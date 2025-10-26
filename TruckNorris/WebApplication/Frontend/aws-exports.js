const awsconfig = {
    // AWS Region
    "aws_project_region": "us-east-1",

    // Cognito User Pool
    "aws_cognito_region": "us-east-1",
    "aws_user_pools_id": "us-east-1_mgSXupPPv",
    "aws_user_pools_web_client_id": "5nmmpkhvfml67u2vd0d79689o1",

    oauth: {
        domain: "https://us-east-1mgsxupppv.auth.us-east-1.amazoncognito.com",
        scope: ["email", "openid", "phone"],
        redirectSignIn: "https://2.d19dxmzb7jtiyo.amplifyapp.com/auth-callback",
        redirectSignOut: "https://2.d19dxmzb7jtiyo.amplifyapp.com",
        responseType: "code" 
      },

    "aws_cognito_storage": window.localStorage,

    // API Gateway (For HTTP API)
    "aws_cloud_logic_custom": [
        {
            "name": "Team18_About_API",
            "endpoint": `${import.meta.env.VITE_API_URL}`, 
            "region": "us-east-1"
        }
    ]
};

export default awsconfig;

