import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ElLoading, ElMessage, type LoadingInstance } from "element-plus";
import { store } from "@/persist";


type HttpOptions = {
    baseURL: string;
    timeout: number;
    cache: boolean;
    cacheTimeout: number;
    loadingText: string;
    loadingLength: number;
};

export interface HttpRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
    loading?: boolean;
    loadingText?: string;
    skipAuth?: boolean;
}

export interface HttpResponseConfig extends AxiosResponse {
    config: any;
}
export interface HttpResponse<T = unknown> {
    code: string;
    message?: string;
    data?: T;
}

export interface RequestConfig {
    url: string;
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    data?: Record<string, any>;
    params?: Record<string, any>;
    config?: HttpRequestConfig;

}

const defualtHttpOptions: Required<HttpOptions> = {
    baseURL: "",
    timeout: 20000,
    cache: false,
    cacheTimeout: 60000,
    loadingText: '加载中...',
    loadingLength: 0
};



export class Http {
    public baseURL: HttpOptions['baseURL'];
    public timeout: HttpOptions['timeout'];
    public cache: HttpOptions['cache'];
    public cacheTimeout: HttpOptions['cacheTimeout'];
    private instance: AxiosInstance;
    private loadingInstance: LoadingInstance | null = null;
    private loadingText: HttpOptions['loadingText'];
    private loadingLength: HttpOptions['loadingLength'];

    constructor(options: Partial<HttpOptions>) {
        const opt = { ...defualtHttpOptions, ...options };
        this.baseURL = opt.baseURL;
        this.timeout = opt.timeout;
        this.cache = opt.cache;
        this.cacheTimeout = opt.cacheTimeout;
        this.loadingText = opt.loadingText;
        this.loadingLength = opt.loadingLength;
        this.instance = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
        });

        this.requestInterceptors();
        this.responseInterceptors();
    }

    private requestInterceptors() {
        this.instance.interceptors.request.use(config => {
            const cfg = config as HttpRequestConfig

            if (cfg.loading) {
                this.showLoading();
            }

            const accessToken = store.getStorage('accessToken') || ""

            if (accessToken)
                config.headers.Authorization = `Bearer ${accessToken}`;

            return config;
        }, error => {
            return Promise.reject(error);
        })
    }
    private responseInterceptors() {
        this.instance.interceptors.response.use(async (response: AxiosResponse<HttpResponse>) => {
            const cfg = response.config as HttpRequestConfig;
            if (cfg.loading) {
                this.hideLoading();
            }

            switch (response.data.code) {
                case '0':
                    return response;
                case "401":
                    if (!cfg.skipAuth) { // 不是刷新请求，尝试刷新 token
                        const isRefreshSuccess = await refreshToken();
                        if (isRefreshSuccess) {
                            // 使用新的令牌 
                            response.config.headers.Authorization = `Bearer ${store.getStorage('accessToken')}`;
                            const resp = await this.instance.request(cfg);
                            return resp;
                        }
                    }

                    ElMessage.error(response.data.message || '未授权，请重新登录');
                    setTimeout(() => window.location.assign('/login'), 700)
                    return Promise.reject(response);
                default:
                    ElMessage.error(response.data.message || '请求失败');
                    return Promise.reject(response);
            }
        }, error => {
            // HTTP 状态码不在 2xx
            return Promise.reject(error);
        })
    }

    private showLoading(text?: string) {
        if (this.loadingLength <= 0) {

            this.loadingInstance = ElLoading.service({
                lock: true,
                text: text || this.loadingText,
                background: "rgba(0, 0, 0, 0.7)",
            });
        }
        this.loadingLength++;
    }

    private hideLoading() {
        this.loadingLength--;
        if (this.loadingLength <= 0 && this.loadingInstance) {
            this.loadingInstance.close();
            this.loadingInstance = null;
        }
    }
    private request<T = unknown>(requestConfig: RequestConfig): Promise<HttpResponse<T>> {
        const { url, method, data, params, config } = requestConfig;

        return new Promise((resolve, reject) => {
            this.instance.request({
                url,
                method,
                data,
                params,
                ...config
            })
                .then((response) => {
                    const res = response as AxiosResponse<HttpResponse<T>>
                    resolve(res.data)
                })
                .catch(error => reject(error));
        });
    }

    public get<T = unknown,>(url: string, params?: Record<string, any>, config?: HttpRequestConfig) {
        return this.request<T>({
            url,
            method: 'get',
            params,
            config
        });
    }
    public post<T = unknown>(url: string, data?: Record<string, any>, config?: HttpRequestConfig) {
        return this.request<T>({
            url,
            method: 'post',
            data,
            config
        });
    }
    public patch<T = unknown>(url: string, data?: Record<string, any>, config?: HttpRequestConfig) {
        return this.request<T>({
            url,
            method: 'patch',
            data,
            config
        });
    }
    public delete<T = unknown>(url: string, config?: HttpRequestConfig) {
        return this.request<T>({
            url,
            method: 'delete',
            config
        });
    }
    public put<T = unknown>(url: string, data?: Record<string, any>, config?: HttpRequestConfig) {
        return this.request<T>({
            url,
            method: 'put',
            data,
            config
        });
    }


}

const http = new Http({ baseURL: '/api' })

export async function refreshToken() {
    const res = await http.post<{
        accessToken: string;
        refreshToken: string;
    }>('/auth/refresh', { refreshToken: store.getStorage('refreshToken') }, { skipAuth: true })
    if (res.code === '0' && res.data?.accessToken && res.data?.refreshToken) {
        store.setStorage('accessToken', res.data.accessToken)
        store.setStorage('refreshToken', res.data.refreshToken)
    }
    return true
}