function mergeRefs(...inputRefs) {
    return (ref) => {
        inputRefs.forEach((inputRef) => {
            if (!inputRef) {
                return;
            }

            if (typeof inputRef === 'function') {
                inputRef(ref);
            } else {
                inputRef.current = ref;
            }
        });
    };
}

export default mergeRefs;