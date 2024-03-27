HMR，模块热替换。
通过HRM可以实现局部刷新和状态保存。

###  HMR API
```ts
interface ImportMeta {
  readonly hot?: {
    readonly data: any
    accept(): void
    accept(cb: (mod: any) => void): void
    accept(dep: string, cb: (mod: any) => void): void
    accept(deps: string[], cb: (mods: any[]) => void): void
    prune(cb: () => void): void
    dispose(cb: (data: any) => void): void
    decline(): void
    invalidate(): void
    on(event: string, cb: (...args: any[]) => void): void
  }
}
```
`import.meta`对象为现代浏览器原生的一个内置对象，Vite 所做的事情就是在这个对象上的 `hot` 属性中定义了一套完整的属性和方法。

#### 模块更新时逻辑: hot.accept

accept就是接受模块更新的。一旦Vite接受了这个更新，当前模块就会被认为是HMR的边界。
Viet接受更新的情况：
- 接受自身模块更新
	- 当模块接受自身的更新时，则当前模块会被认为 HMR 的边界
- 接受某个子模块更新
	- 
- 接受多个子模块更新
	- **父模块可以接受多个子模块的更新，当其中任何一个子模块更新之后，父模块会成为 HMR 边界**。

#### 模块销毁时逻辑: hot.dispose
- 代表在模块更新、旧模块需要销毁时需要做的一些事情

#### 共享数据: hot.data 属性
- 这个属性用来在不同的模块实例间共享一些数据。