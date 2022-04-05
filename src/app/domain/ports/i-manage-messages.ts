export default interface IManageMessages{
    
    messages: string[];
    
    add(message: string): void
    clear(): void
}