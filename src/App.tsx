import { useState, useEffect } from 'react'
import './App.css'

// ============================================================
// CONSTANTES
// ============================================================
const THEME = {
  light: {
    bg: '#ffffff',
    bgAlt: '#ffffff',
    text: '#000000',
    border: '#ddd',
    inputBorder: '#ccc',
    buttonBg: '#ddd',
    buttonHover: '#bbb'
  },
  dark: {
    bg: '#1a1a1a',
    bgAlt: '#2a2a2a',
    text: '#ffffff',
    border: '#444',
    inputBorder: '#555',
    buttonBg: '#555',
    buttonHover: '#777'
  }
} as const

const CONFIG = {
  numbersCount: 16,
  maxRandomNumber: 50,
  minRandomNumber: 1,
  rowCount: 8,
  columnsPerGroup: 3,
  seedMultiplier1: 12.9898,
  seedMultiplier2: 43758.5453
} as const

const BORDER = {
  thick: '4px',
  thin: '1px',
  table2: '2px'
} as const

const SPACING = {
  cellPadding: '8px',
  containerPadding: '20px',
  controlsGap: '10px',
  tableMargin: '30px',
  controlsBottom: '20px',
  controlsRight: '20px'
} as const

// ============================================================
// TIPOS
// ============================================================
type BorderConfig = {
  top: string
  left: string
  right: string
  bottom: string
}

// ============================================================
// CONFIGURACIÓN DE FILAS
// ============================================================
const TABLE1_ROW_CONFIGS = [
  // Filas 1, 3, 5, 7 (4 columnas con colSpan=3)
  { type: '4cols' as const, borders: { top: BORDER.thick, bottom: BORDER.thin } },
  { type: '12cols' as const, borders: { top: BORDER.thin, bottom: BORDER.thick } },
  { type: '4cols' as const, borders: { top: BORDER.thin, bottom: BORDER.thin } },
  { type: '12cols' as const, borders: { top: BORDER.thin, bottom: BORDER.thick } },
  { type: '4cols' as const, borders: { top: BORDER.thick, bottom: BORDER.thin } },
  { type: '12cols' as const, borders: { top: BORDER.thin, bottom: BORDER.thick } },
  { type: '4cols' as const, borders: { top: BORDER.thick, bottom: BORDER.thin } },
  { type: '12cols' as const, borders: { top: BORDER.thin, bottom: BORDER.thick } }
]

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================
const seededRandom = (seedValue: number, index: number): number => {
  const x = Math.sin((seedValue + index) * CONFIG.seedMultiplier1) * CONFIG.seedMultiplier2
  return x - Math.floor(x)
}

const generateNumbers = (seed: number): number[] => {
  const numbers: number[] = []
  for (let i = 0; i < CONFIG.numbersCount; i++) {
    const randomValue = seededRandom(seed, i)
    const number = Math.floor(randomValue * CONFIG.maxRandomNumber) + CONFIG.minRandomNumber
    numbers.push(number)
  }
  return numbers.sort((a, b) => a - b)
}

const getTheme = (isDark: boolean) => isDark ? THEME.dark : THEME.light

const createCellBorderStyle = (
  borders: BorderConfig,
  theme: typeof THEME.light | typeof THEME.dark
) => ({
  borderTop: `${borders.top} solid ${theme.border}`,
  borderLeft: `${borders.left} solid ${theme.border}`,
  borderRight: `${borders.right} solid ${theme.border}`,
  borderBottom: `${borders.bottom} solid ${theme.border}`,
  padding: SPACING.cellPadding,
  backgroundColor: theme.bgAlt,
  color: theme.text
})

const getBordersFor4ColCell = (colIndex: number, topBottom: { top: string; bottom: string }): BorderConfig => ({
  top: topBottom.top,
  bottom: topBottom.bottom,
  left: colIndex === 0 ? BORDER.thick : BORDER.thin,
  right: BORDER.thick
})

const getBordersFor12ColCell = (colIndex: number, topBottom: { top: string; bottom: string }): BorderConfig => {
  const isGroupEnd = (colIndex + 1) % CONFIG.columnsPerGroup === 0
  return {
    top: topBottom.top,
    bottom: topBottom.bottom,
    left: colIndex === 0 ? BORDER.thick : BORDER.thin,
    right: isGroupEnd ? BORDER.thick : BORDER.thin
  }
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
function App() {
  // Estado
  const [seed, setSeed] = useState(Math.random())
  const [inputSeed, setInputSeed] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const theme = getTheme(darkMode)
  const numbers = generateNumbers(seed)

  // Actualizar el color del body cuando cambia el modo oscuro
  useEffect(() => {
    document.body.style.transition = 'background-color 0.3s, color 0.3s'
    document.body.style.backgroundColor = theme.bg
    document.body.style.color = theme.text
  }, [darkMode, theme.bg, theme.text])

  // Handlers
  const handleChangeSeed = () => {
    setSeed(inputSeed.trim() === '' ? Math.random() : parseFloat(inputSeed))
    setInputSeed('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleChangeSeed()
  }

  // Estilos de botones
  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: theme.buttonBg,
    color: theme.text,
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  }

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean) => {
    e.currentTarget.style.backgroundColor = isEnter ? theme.buttonHover : theme.buttonBg
  }

  return (
    <>
      <div style={{ 
        padding: SPACING.containerPadding, 
        backgroundColor: theme.bg, 
        color: theme.text, 
        minHeight: '100vh', 
        transition: 'background-color 0.3s, color 0.3s' 
      }}>
        <h1 className="text-5xl font-bold text-center mb-10 bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Tetonor
        </h1>

        {/* Tabla 1: 8 filas alternando 4 y 12 columnas */}
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          marginBottom: SPACING.tableMargin, 
          borderRadius: '6px', 
          overflow: 'hidden'
        }}>
          <tbody>
            {TABLE1_ROW_CONFIGS.map((rowConfig, rowIndex) => (
              <tr key={rowIndex}>
                {rowConfig.type === '4cols' ? (
                  // Fila con 4 columnas (colSpan=3 cada una)
                  Array.from({ length: 4 }, (_, colIndex) => {
                    const borders = getBordersFor4ColCell(colIndex, rowConfig.borders)
                    return (
                      <td key={colIndex} colSpan={CONFIG.columnsPerGroup} style={createCellBorderStyle(borders, theme)}>
                        Col {colIndex + 1}
                      </td>
                    )
                  })
                ) : (
                  // Fila con 12 columnas
                  Array.from({ length: 12 }, (_, colIndex) => {
                    const borders = getBordersFor12ColCell(colIndex, rowConfig.borders)
                    return (
                      <td key={colIndex} style={createCellBorderStyle(borders, theme)}>
                        Col {colIndex + 1}
                      </td>
                    )
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tabla 2: 1 fila con 16 columnas con números generados */}
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          marginBottom: SPACING.tableMargin, 
          tableLayout: 'fixed', 
          borderRadius: '6px', 
          overflow: 'hidden'
        }}>
          <tbody>
            <tr>
              {numbers.map((number, index) => (
                <td key={index} style={{ 
                  border: `${BORDER.table2} solid ${theme.border}`, 
                  padding: SPACING.cellPadding, 
                  textAlign: 'center', 
                  backgroundColor: theme.bgAlt, 
                  color: theme.text 
                }}>
                  {number}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* Controles de semilla y tema */}
        <div style={{ 
          position: 'fixed', 
          bottom: SPACING.controlsBottom, 
          right: SPACING.controlsRight, 
          display: 'flex', 
          gap: SPACING.controlsGap, 
          alignItems: 'center' 
        }}>
          <input
            type="text"
            value={inputSeed}
            onChange={(e) => setInputSeed(e.target.value)}
            placeholder="Ingresa semilla"
            style={{ 
              padding: '8px', 
              borderRadius: '4px', 
              border: `1px solid ${theme.inputBorder}`, 
              backgroundColor: darkMode ? '#333' : theme.bg, 
              color: theme.text 
            }}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleChangeSeed}
            style={buttonStyle}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            Cambiar Semilla
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ ...buttonStyle, width: '80px' }}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            {darkMode ? 'Claro' : 'Oscuro'}
          </button>
        </div>
      </div>
    </>
  )
}

export default App
