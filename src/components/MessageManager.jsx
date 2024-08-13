import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Send as SendIcon, Star as StarIcon } from '@mui/icons-material';
import Papa from 'papaparse';

const MessageManager = () => {
  const [csvData, setCsvData] = useState([]);
  const [csvFileName, setCsvFileName] = useState(''); 
  const [content, setContent] = useState('');
  const [improvedContent, setImprovedContent] = useState('');
  const [lastOriginalContent, setLastOriginalContent] = useState(''); // Track the last improved text
  const [status, setStatus] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState(''); 
  const [imageStatus, setImageStatus] = useState('');
  const [toggle, setToggle] = useState('original');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');

  const API_KEY = 'emeron'; 
  const BASE_URL = 'http://localhost:3000'; 
  const OPENAI_API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/session/sessions`, {
          headers: {
            'x-api-key': API_KEY
          }
        });
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error('Erro ao buscar sessões:', error);
      }
    };

    fetchSessions();
  }, []);

  const formatChatId = (chatId) => {
    if (!chatId.endsWith('@c.us')) {
      return `${chatId}@c.us`;
    }
    return chatId;
  };

  const sendMessage = async (chatId) => {
    try {
      const formattedChatId = formatChatId(chatId);

      const response = await fetch(`${BASE_URL}/client/sendMessage/${selectedSession}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'accept': '*/*'
        },
        body: JSON.stringify({
          chatId: formattedChatId,
          contentType: "string",
          content: toggle === 'original' ? content : improvedContent
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

      const response = await fetch(`${BASE_URL}/client/sendMessage/${selectedSession}`, {
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

  const handleSendMessageToAll = async () => {
    try {
      if (csvData.length === 0) {
        console.error('Nenhum dado carregado do CSV');
        return;
      }

      for (let i = 0; i < csvData.length; i++) {
        const chatId = csvData[i][0];
        const success = await sendMessage(chatId);
        if (success) {
          setStatus(`Mensagem enviada para ${chatId} com sucesso!`);
        } else {
          setStatus(`Erro ao enviar mensagem para ${chatId}`);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagens:', error);
      setStatus('Erro ao enviar mensagens. Verifique o console para detalhes.');
    }
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    setImageFileName(file.name); 
  };

  const handleSendImageMessage = async () => {
    if (!imageFile) {
      console.error('Nenhum arquivo de imagem selecionado');
      setImageStatus('Nenhum arquivo de imagem selecionado');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        const mimetype = imageFile.type;
        const filename = imageFile.name;

        for (let i = 0; i < csvData.length; i++) {
          const chatId = csvData[i][0];
          const success = await sendImageMessage(chatId, base64String, mimetype, filename);
          if (success) {
            setImageStatus(`Imagem enviada para ${chatId} com sucesso!`);
          } else {
            setImageStatus(`Erro ao enviar imagem para ${chatId}`);
          }
        }
      };
      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error('Erro ao enviar mensagem de imagem:', error);
      setImageStatus('Erro ao enviar mensagem de imagem. Verifique o console para detalhes.');
    }
  };

  const improveText = async (text) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `Melhore o seguinte texto, deixe mais atrativo: ${text}` }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data && data.choices && data.choices.length > 0) {
        setImprovedContent(data.choices[0].message.content);
        setLastOriginalContent(text); // Atualiza o último texto original melhorado
      } else {
        console.error('Resposta inesperada da API:', data);
      }
    } catch (error) {
      console.error('Erro ao melhorar o texto:', error);
    }
  };

  const handleToggleChange = async (event, newToggle) => {
    if (newToggle === 'improve' && content !== lastOriginalContent) {
      await improveText(content);
    }
    setToggle(newToggle);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel id="session-select-label">Selecione uma Sessão</InputLabel>
          <Select
            labelId="session-select-label"
            id="session-select"
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            label="Selecione uma Sessão"
          >
            {sessions.map((session) => (
              <MenuItem key={session} value={session}>
                {session}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, width: '100%', justifyContent: 'center' }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Disparar Mensagem
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
              Enviar Mensagem de Texto
            </Typography>
            <TextField
              fullWidth
              id="content"
              label="Conteúdo da Mensagem"
              multiline
              rows={4}
              value={toggle === 'original' ? content : improvedContent}
              onChange={(e) => setContent(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <ToggleButtonGroup
              value={toggle}
              exclusive
              onChange={handleToggleChange}
              sx={{ mb: 2 }}
            >
              <ToggleButton value="original">Texto original</ToggleButton>
              <ToggleButton value="improve"><StarIcon /> Melhorar texto usando IA</ToggleButton>
            </ToggleButtonGroup>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
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
                  startIcon={<SendIcon />}
                  onClick={handleSendMessageToAll}
                  sx={{ mt: 2 }}
                >
                  Enviar Mensagem para Todos
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Status: {status}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Enviar Mensagem de Imagem
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
                  Selecionar Imagem
                  <input type="file" hidden accept="image/*" onChange={handleImageFileChange} />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Arquivo de imagem selecionado: {imageFileName}
                </Typography>
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
                  startIcon={<SendIcon />}
                  onClick={handleSendImageMessage}
                  sx={{ mt: 2 }}
                >
                  Enviar Imagem para Todos
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Status: {imageStatus}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default MessageManager;
