import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const main = () => {
    const app = express()
    const PORT = 4040

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    app.use(express.static(path.join(__dirname, '../__client/dist')));
    
    app.get('/api/hello', (req, res) => {
      res.json({ message: "Hello from the Express server!" });
    });
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../__client/dist/index.html'));
    });
    
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
    })
}

main()