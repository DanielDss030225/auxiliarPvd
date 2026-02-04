import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

// URL DO SEU SITE DEPOIS DE HOSPEDADO (Vercel, Netlify, etc)
// ATENÇÃO: Troque este link pelo link real do seu site!
const SITE_URL = 'https://danieldss030225.github.io/auxiliarPvd/';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <WebView
                source={require('./assets/www/index.html')}
                style={{ flex: 1 }}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowFileAccess={true}
            />
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
