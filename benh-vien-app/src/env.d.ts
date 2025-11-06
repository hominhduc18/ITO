
interface ImportMetaEnv {
    readonly VITE_API_BASE: string
    readonly VITE_FE_PORT: string

}

interface ImportMeta {
    readonly env: ImportMetaEnv
}