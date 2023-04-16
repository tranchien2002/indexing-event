export function readStringEnv(key: string) {
    if (!process.env[key]) {
    throw Error(`Key ${key} is not exists in env`)
    }
    return process.env[key]
}

export function readBoolEnv(key: string) {
    const value = process.env[key]
    if (!value) {
    throw new Error(`Key ${key} is not exists in env`)
    }
    if (value === 'true' || value === 'false') {
    return value === 'true'
    }
    throw new Error(`Cannot parse key ${key} as bool type`)
}

export function readIntEnv(key: string) {
    const value = process.env[key] || ''
    if (!value) {
    throw new Error(`Key ${key} is not exists in env`)
    }
    try {
    const parsedValue = parseInt(value, 10)
    return parsedValue
    } catch {
    throw new Error(`Cannot parse key ${key} as int type`)
    }
}