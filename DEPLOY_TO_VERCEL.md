# 🚀 Deploy to Vercel - Step by Step Guide

## Quick Deployment (5 minutes)

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up or log in with your GitHub account

3. **Import your repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `IsdCarReservation`
   - Click "Import"

4. **Configure the project**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `build` (auto-filled from vercel.json)
   - **Install Command:** `npm install` (auto-filled)

5. **Add Environment Variables (if needed)**
   - If you want to use your own Supabase project, add:
     - `VITE_SUPABASE_URL` = Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - **Note:** The app currently uses hardcoded credentials in `src/utils/supabase/info.tsx`, so you can skip this step if using the default setup.

6. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your app will be live at: `https://your-project-name.vercel.app`

---

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   cd /Users/macbook/Desktop/isdcar/IsdCarReservation
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No** (first time)
   - Project name? **isd-car-reservation** (or your choice)
   - Directory? **./** (current directory)
   - Override settings? **No**

5. **For production deployment:**
   ```bash
   vercel --prod
   ```

---

## ✅ Post-Deployment Checklist

1. **Test the live URL**
   - Visit your Vercel deployment URL
   - Check if the logo appears correctly at `/images/SchoolLogo.png`
   - Test login with: `admin@school.edu` / `password123`

2. **Verify Environment Variables** (if you added any)
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure all variables are set for Production, Preview, and Development

3. **Check Build Logs**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment to see build logs
   - Ensure build completed successfully

4. **Test All Features**
   - ✅ Login/Signup
   - ✅ Create booking
   - ✅ Admin dashboard
   - ✅ Driver interface
   - ✅ Language switching (EN/FR)

---

## 🔧 Troubleshooting

### Issue: Build fails with "Cannot find module"
**Solution:** Ensure `package.json` has all dependencies listed. Run `npm install` locally first to verify.

### Issue: Blank page after deployment
**Solution:** 
1. Check browser console (F12) for errors
2. Verify the build output directory is `build` (not `dist`)
3. Check Vercel build logs for errors

### Issue: Logo not showing
**Solution:**
1. Ensure `SchoolLogo.png` is in `public/images/` folder
2. Verify the path in code is `/images/SchoolLogo.png` (absolute path)
3. Check Vercel deployment includes the `public` folder

### Issue: API calls failing
**Solution:**
1. Verify Supabase credentials in `src/utils/supabase/info.tsx`
2. Check Supabase Edge Functions are deployed
3. Verify CORS settings in Supabase Dashboard

---

## 📝 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `car-reservation.yourdomain.com`)
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

---

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every push to other branches (creates preview URLs)

To disable auto-deployment:
- Go to Settings → Git → Unlink repository

---

## 📊 Monitoring

Vercel provides:
- **Analytics:** Page views, performance metrics
- **Logs:** Real-time function logs
- **Speed Insights:** Core Web Vitals

Access via: Vercel Dashboard → Your Project → Analytics/Logs

---

## 🎉 You're Done!

Your app is now live on Vercel! 🚀

**Next Steps:**
- Share your deployment URL
- Set up custom domain (optional)
- Monitor performance in Vercel Dashboard
- Enable analytics for insights

