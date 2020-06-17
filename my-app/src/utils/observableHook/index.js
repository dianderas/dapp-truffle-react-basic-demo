import { useEffect, useState } from 'react';

// param: observable<T>
// return: curren value T
export function useObservable(observable) {
    const [value, setValue] = useState(observable.get());

    useEffect(() => {
        return observable.subscribe(setValue);
    }, [observable])

    return value;
}
