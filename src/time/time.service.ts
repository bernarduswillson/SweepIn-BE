/**
 * Get time now
 * 
 * @description get time now
 * @returns Time
 */
const getTime = async () => {

    return new Date().toLocaleTimeString()
}

export { getTime }