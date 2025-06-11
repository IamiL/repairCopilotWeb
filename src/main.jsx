import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppDevelopment from "./inDevelop/development_banner.tsx";

createRoot(document.getElementById('root')).render(
    <AppDevelopment />,
)
