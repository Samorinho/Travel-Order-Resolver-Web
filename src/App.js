import React, { useEffect, useState } from "react";
import axios from "axios"
import { Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import TrainIcon from '@mui/icons-material/Train';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { useTranslation } from "react-i18next";
import { useReactMediaRecorder } from "react-media-recorder";
import i18n from "./i18n"
import "./i18n"

function App() {
  // const API_URL = "http://10.41.166.102:5000";
  const API_URL = "http://10.41.162.141:5000";
  // const API_URL = "http://192.168.43.254:5000";
  const { t } = useTranslation();
  const [language, setLanguage] = useState("")
  const [request, setRequest] = useState("")
  const [path, setPath] = useState([])
  const [disabled, setDisabled] = useState(true)
  const [error, setError] = useState("")
  const [audio, setAudio] = useState(null)
  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
    status
  } = useReactMediaRecorder({ audio: true });
  const API_URL_TEXT = `${API_URL}/api/${language}/itinerary/${request}`
  const API_URL_AUDIO = `${API_URL}/api/${language}/itinerary/audio`

  useEffect(() => {
    const interval = setInterval(() => {
      language ? setDisabled(false) : setDisabled(true)
      if (!request && !audio) {
        setDisabled(true)
      } else {
        setDisabled(false)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [language, request, error, audio])

  useEffect(() => {
    if (!language) {
      return;
    }
    i18n.changeLanguage(language).then()
  }, [language])
  
  useEffect(() => {
    const createAudioFile = () => setAudio(mediaBlobUrl)
    createAudioFile()
  }, [mediaBlobUrl])

  const switchLanguage = (e) => {
    if (!e.target.value) {
      return;
    }
    setLanguage(e.target.value)
  }

  const handleRequest = (e) => setRequest(e.target.value)

  const sendRequest = async () => {
    let blob = await fetch(mediaBlobUrl).then(r => r.blob())
    if (!language && (!audio || !request)) {
      return;
    }
    if (request && !audio) {
      await axios.get(API_URL_TEXT).then((res) => setPath(res.data)).catch((err) => setError(err))
    }
    if (audio && !request) {
      const data = new FormData()
      data.append("audio", blob)
      await axios.post(API_URL_AUDIO, data).then((res) => setPath(res.data)).catch((err) => setError(err))
    }
  }

  return (
    <Grid container>
      <Grid container direction="column" spacing={2} alignContent="center" justifyContent="center">
        <Grid item>
          <Typography variant="h4">Travel Order Resolver</Typography>
        </Grid>
        <Grid item>
          <InputLabel>{t("language.label")}</InputLabel>
          <Select
            sx={{ width: "300px"}}
            value={language}
            label={t("language.label")}
            onChange={switchLanguage}
          >
            <MenuItem value="en">{t("language.english")}</MenuItem>
            <MenuItem value="fr">{t("language.french")}</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Button
            sx={{ width: "300px"}}
            variant="contained"
            onClick={startRecording}
            startIcon={<MicIcon />}
            disabled={status === "recording"}
          >
            {t('button.record')}
          </Button>
        </Grid>
        <Grid item>
          <Button
            sx={{ width: "300px"}}
            variant="contained"
            onClick={stopRecording}
            color="error"
            startIcon={<StopIcon />}
            disabled={status === "stopped" || status === "idle"}
          >
            {t('button.stop')}
          </Button>
        </Grid>
        <Grid item>
          <TextField
            sx={{ width: "300px"}}
            label={t("request")}
            multiline
            rows={4}
            value={request}
            onChange={handleRequest}
          />
        </Grid>
        {audio && (
          <Grid item>
            <audio id="player" src={audio} controls />
          </Grid>
        )}
        <Grid item>
          <Button
            sx={{ width: "300px"}}
            variant="contained"
            onClick={sendRequest}
            disabled={disabled}
          >
            {t("button.send")}
          </Button>
        </Grid>
      </Grid>
      <Grid container direction="column" justifyContent="center" sx={{ marginLeft: "auto", marginRight: "auto" }}>
        {path.length > 0 && (
          <Grid container direction="row" sx={{ marginTop: "1%" }}>
            <Grid item sx={{ marginRight: "1%" }}>
              <TrainIcon color="success"/>
            </Grid>
            <Grid item>
              <Typography>{t("departure")}</Typography>
            </Grid>
          </Grid>
        )}
        {path.length > 0 && path.map((stop, i) => (
          <Grid container direction="row" key={i} sx={{ marginTop: "1%" }}>
            <Grid item sx={{ marginRight: "1%" }}>
              <TrainIcon/>
            </Grid>
            <Grid item>
              <Typography>{stop}</Typography>
            </Grid>
          </Grid>
        ))}
        {path.length > 0 && (
          <Grid container direction="row" sx={{ marginTop: "1%" }}>
            <Grid item sx={{ marginRight: "1%" }}>
              <TrainIcon color="secondary"/>
            </Grid>
            <Grid item>
              <Typography>{t("arrival")}</Typography>
            </Grid>
          </Grid>
        )}
        {error && path.length === 0 && <Typography color="secondary">{error.toString()}</Typography>}
      </Grid>
    </Grid>
  );
}

export default App;
