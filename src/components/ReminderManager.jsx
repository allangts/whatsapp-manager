import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, AccessTime as AccessTimeIcon, Star as StarIcon } from '@mui/icons-material';
import Papa from 'papaparse';
import axios from 'axios';

const ReminderManager = () => {
  const [csvData, setCsvData] = useState([]);
  const [csvFileName, setCsvFileName] = useState(''); 
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [toggle, setToggle] = useState('original');

  const API_KEY = 'emeron'; 
  const BASE_URL = 'http://localhost:3000'; 

  const formatChatId = (chatId) => {
    if (!chatId.endsWith('@c.us')) {
      return `${chatId}@c.us`;
    }
    return chatId;
  };

  const sendMessage = async (chatId) => {
    try {
      const formattedChatId = formatChatId(chatId);

      const response = await fetch(`${BASE_URL}/client/sendMessage/allan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'accept': '*/*'
        },
        body: JSON.stringify({
          chatId: formattedChatId,
          contentType: "string",
          content: content
        })
      });

      const responseData = await response.json();
      console.log(`Mensagem enviada para ${chatId}:`, responseData);
      return true;
    } catch (error) {
      console.error(`Erro ao enviar mensagem para ${chatId}:`, error);
      return false;
    }
  };

  const sendImageMessage = async (chatId, base64Data, mimetype, filename) => {
    try {
      const formattedChatId = formatChatId(chatId);

      const response = await fetch(`${BASE_URL}/client/sendMessage/allan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'accept': '*/*'
        },
        body: JSON.stringify({
          chatId: formattedChatId,
          contentType: 'MessageMedia',
          content: {
            mimetype: mimetype,
            data: base64Data,
            filename: filename
          }
        })
      });

      const responseData = await response.json();
      console.log(`Mensagem de imagem enviada para ${chatId}:`, responseData);
      return true;
    } catch (error) {
      console.error(`Erro ao enviar mensagem de imagem para ${chatId}:`, error);
      return false;
    }
  };

  const handleFileUpload = (data) => {
    console.log('Dados do CSV carregados:', data);
    setCsvData(data.data);
  };

  const handleCSVFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFileName(file.name); 
    Papa.parse(file, {
      complete: handleFileUpload,
      header: false,
      skipEmptyLines: true,
    });
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    setImageFileName(file.name); 
  };

  const handleToggle = async (event, newToggle) => {
    if (newToggle !== null) {
      setToggle(newToggle);
      if (newToggle === 'improved') {
        setOriginalContent(content);
        try {
          const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt: content,
            max_tokens: 100,
          }, {
            headers: {
              'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
            }
          });
          setContent(response.data.choices[0].text);
        } catch (error) {
          console.error('Erro ao melhorar o texto:', error);
          setStatus('Erro ao melhorar o texto.');
        }
      } else {
        setContent(originalContent);
      }
    }
  };

  const scheduleMessage = () => {
    const scheduledTime = new Date(`${date}T${time}:00`);
    const currentTime = new Date();
    const timeDifference = scheduledTime - currentTime;

    if (timeDifference <= 0) {
      setStatus('A data e hora selecionadas já passaram. Por favor, escolha uma data e hora futuras.');
      return;
    }

    setTimeout(async () => {
      try {
        if (csvData.length === 0) {
          console.error('Nenhum dado carregado do CSV');
          return;
        }

        for (let i = 0; i < csvData.length; i++) {
          const chatId = csvData[i][0];

          if (content) {
            const success = await sendMessage(chatId);
            if (success) {
              setStatus(`Mensagem enviada para ${chatId} com sucesso!`);
            } else {
              setStatus(`Erro ao enviar mensagem para ${chatId}`);
            }
          }

          if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64String = reader.result.split(',')[1];
              const mimetype = imageFile.type;
              const filename = imageFile.name;

              const success = await sendImageMessage(chatId, base64String, mimetype, filename);
              if (success) {
                setStatus(`Imagem enviada para ${chatId} com sucesso!`);
              } else {
                setStatus(`Erro ao enviar imagem para ${chatId}`);
              }
            };
            reader.readAsDataURL(imageFile);
          }
        }
      } catch (error) {
        console.error('Erro ao enviar mensagens:', error);
        setStatus('Erro ao enviar mensagens. Verifique o console para detalhes.');
      }
    }, timeDifference);

    setStatus('Mensagem agendada com sucesso!');
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, width: '100%', justifyContent: 'center' }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Agendar Mensagem
          </Typography>
        </Box>
        <Box component="form" sx={{ mt: 0 }}>
          <Paper elevation={3} sx={{ p: 2, mt: 0 }}>
            <Typography variant="h6" gutterBottom>
              Carregar Lista de Contatos (CSV)
            </Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid 
                item 
                xs={12}
                container
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  width='50%'
                  sx={{ mt: 2 }}
                >
                  Selecionar Arquivo CSV
                  <input
                    type="file"
                    hidden
                    accept=".csv"
                    onChange={handleCSVFileChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Arquivo selecionado: {csvFileName}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Editar mensagem
            </Typography>
            <ToggleButtonGroup
              value={toggle}
              exclusive
              onChange={handleToggle}
              aria-label="text formatting"
              sx={{ mb: 2 }}
            >
              <ToggleButton value="original" aria-label="original text">
                Texto original
              </ToggleButton>
              <ToggleButton value="improved" aria-label="improved text">
                <StarIcon /> Melhorar texto usando IA
              </ToggleButton>
            </ToggleButtonGroup>
            <TextField
              fullWidth
              id="content"
              label="Conteúdo da Mensagem"
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid 
                item 
                xs={12}
                container
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  width='50%'
                  sx={{ mt: 2 }}
                >
                  Selecionar Imagem
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Arquivo de imagem selecionado: {imageFileName}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="date"
                  label="Data"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="time"
                  label="Hora"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid 
                item 
                xs={12}
                container
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  color="primary"
                  width='50%'
                  startIcon={<AccessTimeIcon />}
                  onClick={scheduleMessage}
                  sx={{ mt: 2 }}
                >
                  Agendar Mensagem
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Status: {status}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default ReminderManager;
