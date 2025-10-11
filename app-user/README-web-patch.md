# Quick patch notes for **userApp** (Expo Web)

1) **Avoid running native push-notifications on web**  
   Replace the import at the top of `App.tsx`:

   ```diff
   - import "@/notify";
   + import { Platform } from "react-native";
   + if (Platform.OS !== "web") {
   +   require("@/notify");
   + }
   ```

2) **Use Webpack bundler and module aliases**  
   In `app.json` under `expo.web`, set:

   ```json
   {
     "expo": {
       "web": {
         "bundler": "webpack",
         "output": "static",
         "favicon": "./assets/favicon.png"
       }
     }
   }
   ```

   Then add the provided `webpack.config.js` to the project root and the three files inside `src/shims/`.

3) **Run the web**

```bash
npm i
npm run web
```

> ملاحظات:
> - تم عمل Shims مؤقتة لـ `react-native-maps`, `@gorhom/bottom-sheet`, و `react-native-webview` لتشغيل الويب سريعًا.
> - لاحقًا استبدل خريطة الويب بحل كامل (Google Maps JS أو MapLibre) عبر مكوّن خاص.
> - لو ظهر تحذير متعلق بـ Reanimated، أضف/حدّث Plugin في `babel.config.js` إلى:
>   ```js
>   plugins: [
>     ["module-resolver", {...}],
>     "react-native-reanimated/plugin" // اجعله آخر Plugin
>   ]
>   ```
