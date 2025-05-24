# 4VChef — Aplicación Frontend en Angular

Este proyecto es el **frontend oficial** de 4VChef, desarrollado en **Angular** con estilos en **Bootstrap**.  
Permite visualizar, puntuar y crear recetas conectándose a la API Symfony del backend.

---

## ⚙️ Requisitos

- Node.js  
- Bun (o cualquier gestor de paquetes similar)  
- Angular CLI
- Backend (proyecto e instrucciones en el otro repositorio)

---

## 🚀 Instalación y puesta en marcha

```bash
# Clonar el repositorio
git clone https://github.com/JulenMO/frontend-4vchef.git
cd 4vchef-frontend

# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
ng serve
```

> Una vez iniciado, entra en:  
> `http://localhost:4200`

---

## 🔄 Conexión con el backend

Este frontend requiere que el backend Symfony esté activo en:  
`http://localhost:8000`

> Asegúrate de tener ejecutado el servidor con:
> ```bash
> symfony serve
> ```

---

## ⚠️ Observación técnica

En algunos casos, la primera vez que se accede a la página las recetas pueden no mostrarse correctamente.  
Esto debería resolverse automáticamente al **refrescar la página** o navegar entre pestañas de la página.

---

## ✅ Funcionalidades

- Listado completo de recetas
- Filtros por calorías y valoración media
- Creación de recetas con formulario
- Modal detallado con ingredientes, pasos y nutrientes
- Valoración mediante estrellas

---
