import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const SessionManager = () => {
  const [sessionId, setSessionId] = useState('');
  const [sessionStatus, setSessionStatus] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const API_KEY = 'emeron'; // Substitua pela sua chave de API real

  const api = axios.create({
    baseURL: 'http://localhost:3000', // Substitua pelo URL do seu backend
  });

  const handleStartSession = async () => {
    try {
      if (!sessionId) {
        console.error('Session ID não pode estar vazio');
        return;
      }

      const response = await api.get(`/session/start/${sessionId}`, {
        headers: {
          'x-api-key': API_KEY
        }
      });

      console.log(response.data);
      setSessionStatus(response.data.message);
    } catch (error) {
      if (error.response) {
        console.error('Erro de resposta:', error.response.data);
        setSessionStatus(`Erro: ${error.response.data.error}`);
      } else if (error.request) {
        console.error('Erro de requisição:', error.request);
        setSessionStatus('Erro de requisição. Nenhuma resposta recebida.');
      } else {
        console.error('Erro geral:', error.message);
        setSessionStatus(`Erro: ${error.message}`);
      }
    }
  };

  const handleGetQrCode = async () => {
    try {
      if (!sessionId) {
        console.error('Session ID não pode estar vazio');
        return;
      }

      const response = await api.get(`/session/qr/${sessionId}/image`, {
        responseType: 'blob',
        headers: {
          'x-api-key': API_KEY
        }
      });
      const imageUrl = URL.createObjectURL(response.data);
      setQrCodeUrl(imageUrl);
    } catch (error) {
      console.error('Erro ao obter o código QR:', error);
      setSessionStatus('Erro ao obter o código QR.');
    }
  };

  const handleTerminateAllSessions = async () => {
    try {
      const response = await api.get('/session/terminateAll', {
        headers: {
          'accept': 'application/json',
          'x-api-key': API_KEY
        }
      });

      console.log(response.data);
      setSessionStatus('Todas as sessões foram encerradas.');
    } catch (error) {
      console.error('Erro ao encerrar todas as sessões:', error);
      setSessionStatus('Erro ao encerrar todas as sessões.');
    }
  };

  const handleSessionIdChange = (e) => {
    const value = e.target.value;
    const validValue = value.replace(/[^a-z0-9-]/g, '');
    setSessionId(validValue);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, width: '100%', justifyContent: 'center' }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Iniciar Sessão
          </Typography>
        </Box>
        <Box component="form" sx={{ mt: 0 }}>
          <Paper elevation={3} sx={{ p: 2, mt: 0 }}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12} container justifyContent="center">
                <TextField
                  fullWidth
                  id="sessionId"
                  label="Session ID"
                  value={sessionId}
                  onChange={handleSessionIdChange}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid 
                  item 
                  xs={12}
                  container
                  justifyContent="center"
                >
                  <Button
                    onClick={handleStartSession}
                    variant="contained"
                    width='50%'
                    sx={{ mt: 2 }}
                  >
                    Iniciar Sessão
                  </Button>
                </Grid>
                <Grid 
                  item 
                  xs={12}
                  container
                  justifyContent="center"
                >
                  <Button
                    onClick={handleGetQrCode}
                    variant="contained"
                    width='50%'
                    sx={{ mt: 2 }}
                  >
                    Obter QR Code
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12} container justifyContent="center">
                {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
              </Grid>
              <Grid item xs={12} container justifyContent="center">
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  Session Status: {sessionStatus}
                </Typography>
              </Grid>
              <Grid item xs={12} container justifyContent="center">
                <Button
                  onClick={handleTerminateAllSessions}
                  variant="contained"
                  width='50%'
                  sx={{ mt: 2, bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
                >
                  Encerrar Todas as Sessões
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default SessionManager;
