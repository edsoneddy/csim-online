import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

console.log('main.jsx loading...')

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('React rendered successfully')
} catch (error) {
  console.error('React render error:', error)
}
