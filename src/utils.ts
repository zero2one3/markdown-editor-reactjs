export function debounce(fn: Function, delay = 500) {
    let timer: any;

    return function(...args: any[]) {
        if(timer) clearTimeout(timer)
        timer = setTimeout(() => {
            
            fn.apply(this, args)
        }, delay)
    }
}