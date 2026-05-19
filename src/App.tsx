import { setupPixivnViteData } from "@drincs/pixi-vn/vite-listener";
import { ComponentType, lazy, Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useI18n } from "./i18n";
import LoadingScreen from "./screens/LoadingScreen";
import { defineAssets } from "./utils/assets-utility";
import { initializeIndexedDB } from "./utils/indexedDB-utility";

const Home = lazy(async () => {
    await Promise.all([import("./values"), import("./labels")]);
    await Promise.all([initializeIndexedDB(), defineAssets(), useI18n()]);
    setupPixivnViteData();
    return import("./Home");
});

const ErrorFallback: ComponentType<FallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div
            role="alert"
            className="pointer-events-auto bg-black min-h-screen flex flex-col items-center justify-center px-4"
        >
            <h2 className="text-red-500 text-3xl text-center mt-4 font-bold">
                Something went wrong
            </h2>
            <p className="text-white text-xl text-center mt-4 max-w-full break-words">
                {(error as Error).message}
            </p>
            <div className="flex justify-center mt-6 pb-4">
                <button
                    className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    onClick={resetErrorBoundary}
                >
                    Try again
                </button>
            </div>
        </div>
    );
};

export default function App() {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingScreen />}>
                <Home />
            </Suspense>
        </ErrorBoundary>
    );
}
