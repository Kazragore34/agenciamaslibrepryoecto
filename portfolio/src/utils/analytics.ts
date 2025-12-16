// Google Analytics 4 integration

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

const GA4_ID = import.meta.env.VITE_GA4_ID

export function initAnalytics() {
  if (!GA4_ID) {
    console.warn('GA4_ID not configured')
    return
  }

  // Cargar script de GA4
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA4_ID)
}

export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams)
  }
}

export function trackPageView(path: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA4_ID, {
      page_path: path,
    })
  }
}

// Eventos específicos
export const analyticsEvents = {
  pageView: (path: string) => trackPageView(path),
  serviceView: (serviceName: string) => trackEvent('service_view', { service_name: serviceName }),
  projectClick: (projectName: string) => trackEvent('project_click', { project_name: projectName }),
  retellCallStarted: () => trackEvent('retell_call_started'),
  chatbotMessage: () => trackEvent('chatbot_message'),
  formSubmit: (formName: string) => trackEvent('form_submit', { form_name: formName }),
  download: (fileName: string) => trackEvent('download', { file_name: fileName }),
}
