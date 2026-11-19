/** @type {import("next").NextConfig} */
module.exports={async headers(){return[{source:"/(.*)",headers:[{key:"Strict-Transport-Security",value:"max-age=63072000; includeSubDomains"},{key:"X-Content-Type-Options",value:"nosniff"}]}]}}
