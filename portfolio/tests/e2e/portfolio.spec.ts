import { test, expect } from '@playwright/test'

test.describe('Portfolio E2E Tests', () => {
  test('debe cargar la página principal', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Desarrollador Web')
  })

  test('debe navegar entre páginas', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Servicios')
    await expect(page).toHaveURL(/.*servicios/)
    
    await page.click('text=Proyectos')
    await expect(page).toHaveURL(/.*proyectos/)
  })

  test('debe mostrar el chatbot IAN', async ({ page }) => {
    await page.goto('/')
    
    // Verificar que el botón del chatbot existe
    const chatButton = page.locator('button[aria-label="Abrir chat con IAN"]')
    await expect(chatButton).toBeVisible()
    
    // Abrir el chat
    await chatButton.click()
    
    // Verificar que la ventana del chat se abre
    await expect(page.locator('text=IAN - Asistente IA')).toBeVisible()
  })

  test('debe mantener el chat al navegar', async ({ page }) => {
    await page.goto('/')
    
    // Abrir chat y enviar mensaje
    await page.click('button[aria-label="Abrir chat con IAN"]')
    await page.fill('input[placeholder="Escribe tu mensaje..."]', 'Hola')
    await page.press('input[placeholder="Escribe tu mensaje..."]', 'Enter')
    
    // Navegar a otra página
    await page.click('text=Servicios')
    
    // Verificar que el chat sigue abierto
    await expect(page.locator('text=IAN - Asistente IA')).toBeVisible()
  })

  test('debe mostrar el formulario de contacto', async ({ page }) => {
    await page.goto('/contacto')
    await expect(page.locator('h1')).toContainText('Contacto')
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('textarea')).toBeVisible()
  })
})
