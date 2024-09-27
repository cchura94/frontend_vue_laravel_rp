import axios from "axios";

const url_base = "http://127.0.0.1:8000/api";

export default function Api() {

    const token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: url_base,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+ token
        }
    })

    // interceptar
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            // error de autenticación
            if(error.response.status === 401){
                console.log("INTERCEPTOR **** 401")
                
                localStorage.removeItem("access_token");
                window.location.href = "/login"
            }

            // error de autorización
            if(error.response.status === 403){
                console.log("INTERCEPTOR **** 403")

            }

            return Promise.reject(error);
        }
    )

    return api
}
