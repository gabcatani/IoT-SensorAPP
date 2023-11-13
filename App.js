import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

const App = () => {
  const [ledOn, setLedOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sensorData, setSensorData] = useState({
    temperatura: '--',
    umidade: '--'
  });

  const toggleLED = async () => {
    setLoading(true);
    const url = ledOn ? 'http://herculanodebiasi.dyndns-ip.com:9090/ledoff' : 'http://herculanodebiasi.dyndns-ip.com:9090/ledon';

    try {
      const response = await fetch(url, { method: 'POST' });
      if (response.ok) {
        setLedOn(!ledOn);
      } else {
        Alert.alert('Erro', 'Não foi possível alterar o estado do LED.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSensorData = async () => {
    try {
      const response = await fetch('http://herculanodebiasi.dyndns-ip.com:9090/lesensor');
      const data = await response.json();
      setSensorData(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os dados do sensor.');
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Servidor Web ESP32</Text>
        <Text style={styles.subtitle}>Sensor DHT</Text>
        
        <View style={styles.sensorContainer}>
          <View style={styles.sensorBox}>
            <Text style={styles.sensorLabel}>Temperatura</Text>
            <Text style={styles.sensorValue}>{sensorData.temperatura}°C</Text>
          </View>
          <View style={styles.sensorBox}>
            <Text style={styles.sensorLabel}>Umidade</Text>
            <Text style={styles.sensorValue}>{sensorData.umidade}%</Text>
          </View>
        </View>

        <View style={styles.ledContainer}>
          <Text style={styles.ledLabel}>Estado do LED: {ledOn ? 'Ligado' : 'Desligado'}</Text>
          <TouchableOpacity style={styles.button} onPress={toggleLED} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>{ledOn ? 'OFF' : 'ON'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  container: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  sensorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  sensorBox: {
    alignItems: 'center',
  },
  sensorLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
  },
  sensorValue: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  ledContainer: {
    alignItems: 'center',
  },
  ledLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default App;
