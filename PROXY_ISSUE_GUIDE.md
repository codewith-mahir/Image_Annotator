# Login 404 Error - Comprehensive Troubleshooting Guide

## Problem Summary
Frontend shows `POST http://localhost:3000/api/auth/login 404 (Not Found)` with response `Cannot POST /auth/login`.

This indicates the request is not being proxied to the backend (port 5000), instead hitting the React dev server directly.

## Root Cause
The CRA proxy configuration isn't working as expected. The request path is being modified from `/api/auth/login` to `/auth/login`, suggesting:
1. Proxy middleware isn't intercepting the `/api/*` requests
2. OR setupProxy.js isn't being loaded by Create React App
3. OR there's a conflict between setupProxy.js and package.json proxy field

## Solutions Tried
1. ✅ Added detailed logging to frontend API client
2. ✅ Added detailed logging to LoginPage  
3. ✅ Configured setupProxy.js with http-proxy-middleware
4. ✅ Added "proxy" field to package.json
5. ✅ Enhanced backend error handling and logging
6. ⚠️ Backend process crashes on startup (environmental issue - needs investigation)

## Immediate Workaround: Update API Client to Use Explicit Backend URL

Instead of relying on the proxy, modify the frontend API client to point directly to the backend:

### File: `client/src/api/client.js`

Replace the `inferBaseUrl` function:

```javascript
const inferBaseUrl = () => {
  // Always use direct backend URL during development
  // Skip proxy and go straight to the backend
  return 'http://localhost:5000/api';
};
```

This bypasses the proxy entirely and makes direct requests to the backend. The browser's CORS should allow it since the backend is configured with the correct CORS headers.

## Testing the Workaround

1. **Update the API client file** with the code above
2. **Restart both servers**:
   ```powershell
   # Kill all Node processes
   Get-Process node | Stop-Process -Force
   
   # Terminal 1: Start backend
   cd "e:\Project\Annotator for thesis\server"
   npm run dev
   
   # Terminal 2: Start frontend
   cd "e:\Project\Annotator for thesis\client"
   npm start
   ```

3. **Test login**:
   - Navigate to http://localhost:3000/login
   - Enter credentials: `Mahir1280@gmail.com` / `B@ngladesh71`
   - Click "Sign In"
   - Check browser console (F12 > Console) for logs

## Expected Console Output

After login attempt, you should see:
```javascript
API_BASE_URL: http://localhost:5000/api
API Request: {method: 'POST', url: '/auth/login', fullUrl: 'http://localhost:5000/api/auth/login'}
Login successful: {user: {...}, token: '...'}
```

OR if login fails:
```javascript
Login error: AxiosError {...}
Response status: 401 (or 500)
Response data: {message: '...'}
```

## Alternative Solution: Check Backend Issue

The backend appears to crash immediately after starting. To diagnose:

1. **Check Node process directly**:
   ```powershell
   cd "e:\Project\Annotator for thesis\server"
   node src/index.js
   ```
   
   The server should stay running and show:
   ```
   Allowed CORS origins: [...]
   Connected to MongoDB
   Server listening on port 5000
   ```

2. **If process exits immediately**, check for:
   - Firewall blocking port 5000
   - Another process already using port 5000
   - Missing environment variables in .env
   - MongoDB connection issues

3. **Verify MongoDB connection**:
   ```powershell
   # The .env file should have a valid MONGODB_URI
   # Check that the connection string includes credentials and database name
   ```

## Files to Review

- `client/src/api/client.js` - API client base URL configuration
- `client/src/setupProxy.js` - CRA proxy middleware
- `client/package.json` - Proxy field configuration
- `server/src/index.js` - Backend initialization
- `server/.env` - Environment variables

## Next Steps

1. **Apply the workaround** (direct backend URL)
2. **Test login** and verify it works
3. **Report back** with:
   - Browser console output (F12 > Console)
   - Backend terminal output
   - Any error messages

4. Once login works, we can investigate the proxy issue and the backend startup crash

## Port Allocation

Ensure these ports are available:
- **3000**: React dev server
- **5000**: Express backend
- **27017**: MongoDB (if running locally; otherwise using Atlas)

Check with:
```powershell
netstat -ano | Select-String ":3000|:5000"
```

## Files Modified in This Session

- `client/src/api/client.js` - Added logging and removed unused `port` variable
- `client/src/pages/LoginPage.js` - Added error logging
- `client/src/setupProxy.js` - Enhanced with logging  
- `client/package.json` - Added proxy field
- `server/src/index.js` - Added error handlers and request logging
- `LOGIN_FIX.md` - Previous troubleshooting guide

## Committed Changes

All changes have been committed to Git. To review:
```powershell
cd "e:\Project\Annotator for thesis"
git log --oneline -5
git show HEAD
```
