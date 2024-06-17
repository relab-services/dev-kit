import type { Component } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { CSSProperties } from 'vue';
import { DefineComponent } from 'vue';
import { ExtractPropTypes } from 'vue';
import type { Plugin as Plugin_2 } from 'vue';
import { PropType } from 'vue';
import { PublicProps } from 'vue';

declare type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;

declare type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

declare type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: PropType<T[K]>;
        required: true;
    };
};

declare type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};

declare type CnFunction = (...classes: Array<string | undefined>) => string;

declare type ExternalToast<T extends Component = Component> = Omit<ToastT<T>, 'id' | 'type' | 'title' | 'promise' | 'delete'> & {
    id?: number | string;
};

declare const plugin: Plugin_2;
export default plugin;

declare type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

declare type PromiseData<ToastData = any> = ExternalToast & {
    loading?: string | Component;
    success?: (data: ToastData) => string | Component;
    error?: (data: ToastData) => string | Component;
    description?: string | Component | ((data: any) => Component | string);
    finally?: () => void | Promise<void>;
};

declare type PromiseT<Data = any> = Promise<Data> | (() => Promise<Data>);

declare type Theme = 'light' | 'dark' | 'system';

export declare const toast: ((message: string | Component, data?: ExternalToast) => string | number) & {
    success: (message: string | Component, data?: ExternalToast) => string | number;
    info: (message: string | Component, data?: ExternalToast) => string | number;
    warning: (message: string | Component, data?: ExternalToast) => string | number;
    error: (message: string | Component, data?: ExternalToast) => string | number;
    custom: (component: Component, data?: ExternalToast) => string | number;
    message: (message: string | Component, data?: ExternalToast) => string | number;
    promise: <ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData> | undefined) => string | number | undefined;
    dismiss: (id?: number | string) => string | number | undefined;
    loading: (message: string | Component, data?: ExternalToast) => string | number;
};

declare interface ToastClasses {
    toast?: string;
    title?: string;
    description?: string;
    loader?: string;
    closeButton?: string;
    cancelButton?: string;
    actionButton?: string;
    normal?: string;
    action?: string;
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
    loading?: string;
    default?: string;
}

export declare const Toaster: DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<ToasterProps>, {
invert: boolean;
position: string;
hotkey: () => string[];
expand: boolean;
closeButton: boolean;
class: string;
offset: string;
theme: string;
richColors: boolean;
duration: number;
style: () => {};
visibleToasts: number;
toastOptions: () => {};
dir: string;
gap: number;
containerAriaLabel: string;
pauseWhenPageIsHidden: boolean;
}>, {}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<ToasterProps>, {
invert: boolean;
position: string;
hotkey: () => string[];
expand: boolean;
closeButton: boolean;
class: string;
offset: string;
theme: string;
richColors: boolean;
duration: number;
style: () => {};
visibleToasts: number;
toastOptions: () => {};
dir: string;
gap: number;
containerAriaLabel: string;
pauseWhenPageIsHidden: boolean;
}>>>, {
invert: boolean;
closeButton: boolean;
duration: number;
style: CSSProperties;
class: string;
position: Position;
theme: Theme;
hotkey: string[];
richColors: boolean;
expand: boolean;
gap: number;
visibleToasts: number;
toastOptions: ToastOptions;
offset: string | number;
dir: "rtl" | "ltr" | "auto";
containerAriaLabel: string;
pauseWhenPageIsHidden: boolean;
}, {}>;

export declare interface ToasterProps {
    invert?: boolean;
    theme?: Theme;
    position?: Position;
    hotkey?: string[];
    richColors?: boolean;
    expand?: boolean;
    duration?: number;
    gap?: number;
    visibleToasts?: number;
    closeButton?: boolean;
    toastOptions?: ToastOptions;
    class?: string;
    style?: CSSProperties;
    offset?: string | number;
    dir?: 'rtl' | 'ltr' | 'auto';
    icons?: ToastIcons;
    containerAriaLabel?: string;
    pauseWhenPageIsHidden?: boolean;
    cn?: CnFunction;
}

declare interface ToastIcons {
    success?: Component;
    info?: Component;
    warning?: Component;
    error?: Component;
    loading?: Component;
}

declare interface ToastOptions {
    class?: string;
    closeButton?: boolean;
    descriptionClass?: string;
    style?: CSSProperties;
    cancelButtonStyle?: CSSProperties;
    actionButtonStyle?: CSSProperties;
    duration?: number;
    unstyled?: boolean;
    classes?: ToastClasses;
}

declare type ToastT<T extends Component = Component> = {
    id: number | string;
    title?: string | Component;
    type?: ToastTypes;
    icon?: Component;
    component?: T;
    componentProps?: any;
    invert?: boolean;
    closeButton?: boolean;
    dismissible?: boolean;
    description?: string | Component;
    duration?: number;
    delete?: boolean;
    important?: boolean;
    action?: {
        label: string | Component;
        onClick: (event: MouseEvent) => void;
    };
    cancel?: {
        label: string | Component;
        onClick?: () => void;
    };
    onDismiss?: (toast: ToastT) => void;
    onAutoClose?: (toast: ToastT) => void;
    promise?: PromiseT;
    cancelButtonStyle?: CSSProperties;
    actionButtonStyle?: CSSProperties;
    style?: CSSProperties;
    unstyled?: boolean;
    class?: string;
    classes?: ToastClasses;
    descriptionClass?: string;
    position?: Position;
};

declare type ToastTypes = 'normal' | 'action' | 'success' | 'info' | 'warning' | 'error' | 'loading' | 'default';

export { }
