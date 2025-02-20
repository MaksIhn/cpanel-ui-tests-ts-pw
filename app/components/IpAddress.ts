export function generateIp(): string {

    const random255Int = () => Math.floor(Math.random() * 255) + 1;

    return `${random255Int()}.${random255Int()}.${random255Int()}.${random255Int()}`;
}