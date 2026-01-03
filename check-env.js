const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    console.log('.env.local found');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    console.log('POSTGRES_URL present:', !!envConfig.POSTGRES_URL);
    console.log('BLOB_READ_WRITE_TOKEN present:', !!envConfig.BLOB_READ_WRITE_TOKEN);
    console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY present:', !!envConfig.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
} else {
    console.log('.env.local NOT found');
}
