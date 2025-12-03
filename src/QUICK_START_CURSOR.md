# ⚡ Quick Start Guide for Cursor AI

## 🎯 **3 Steps to Get Running**

### **Step 1: Download from Figma Make**
1. Click **Download/Export** button in Figma Make
2. Extract the ZIP file
3. Open **Cursor AI** → `File` → `Open Folder` → Select extracted folder

### **Step 2: Install & Run**
```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

### **Step 3: Test Login**
Open `http://localhost:5173` and click a quick login button:
- **Admin** → Full dashboard access
- **Employee** → Booking form access
- **Driver** → Driver interface access

---

## 🎨 **Key Files to Know**

```
/App.tsx                    → Main app routing
/components/Login.tsx       → Sign-in page (landing)
/components/AdminDashboard.tsx  → Admin interface
/components/BookingForm.tsx     → Employee booking
/components/DriverInterface.tsx → Driver map
/utils/api.ts              → All API calls
/styles/globals.css        → Design system
```

---

## 🤖 **Using Cursor AI Features**

### **AI Commands:**
- `Cmd/Ctrl + K` → **AI inline edit** (highlight code first)
- `Cmd/Ctrl + L` → **AI chat** (ask questions)
- `Cmd/Ctrl + I` → **Composer** (multi-file edits)

### **Example Prompts:**
```
"Add a new field to the booking form for 'Number of passengers'"
"Explain how the role-based routing works in App.tsx"
"Create a new chart in the Reports dashboard for monthly bookings"
"Make the signin page more accessible with ARIA labels"
```

---

## 🎯 **Most Common Tasks**

### **1. Add a New Field to Booking Form**
```bash
# Open file
components/BookingForm.tsx

# Ask Cursor:
"Add a number input for passenger count below the destination field"
```

### **2. Customize Colors**
```bash
# Open file
styles/globals.css

# Ask Cursor:
"Change the primary gold color to a darker shade"
```

### **3. Create a New Component**
```bash
# Ask Cursor:
"Create a new component called VehicleCard.tsx that displays vehicle info"
```

### **4. Fix a Bug**
```bash
# Highlight the problematic code
# Press Cmd/Ctrl + K
# Type: "Fix the validation issue here"
```

---

## 🔧 **Available Commands**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Check TypeScript types
npm run lint         # Lint code
```

---

## 🎨 **Design System Quick Reference**

```css
/* Colors */
Gold:    #FFD700  (primary actions)
Black:   #000000  (backgrounds)
Orange:  #FFA500  (accents)
White:   #FFFFFF  (text)

/* Gradients */
bg-gradient-to-r from-[#FFD700] to-[#FFA500]

/* Glassmorphism */
bg-white/5 backdrop-blur-xl border border-white/10
```

---

## 📚 **Quick Links**

- **Full Setup:** [CURSOR_SETUP.md](./CURSOR_SETUP.md)
- **README:** [README_CURSOR.md](./README_CURSOR.md)
- **Supabase Dashboard:** https://app.supabase.com/project/syxniswirynimbokvpvq
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev/icons

---

## 🐛 **Common Issues**

### **Port Already in Use**
```bash
npx kill-port 5173
# or
npm run dev -- --port 3000
```

### **Module Not Found**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **TypeScript Errors**
```bash
npm run type-check
# Fix errors, then:
npm run dev
```

---

## ✨ **Pro Tips for Cursor AI**

1. **Use Composer** (Cmd/Ctrl + I) for multi-file changes
2. **Highlight code** before asking Cursor to edit it
3. **Be specific** in prompts: "Add X below Y with Z styling"
4. **Check both roles** when making changes to shared components
5. **Test EN & FR** after changing any text

---

## 🚀 **You're Ready!**

Your ISD Car Reservation app is fully configured and ready to customize in Cursor AI!

**Next Steps:**
1. Run `npm run dev`
2. Test all three user roles
3. Start customizing with Cursor's AI
4. Push to GitHub when ready

**Happy coding! 🎉**
