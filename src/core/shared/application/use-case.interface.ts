
export interface IUseCase<Input, Output> {
    execute(Input: Input): Promise<Output>;
}

