// Tree Shaking
// 把一个模块中没用的东西晃掉：引入的东西做打包，不引入的东西不要打进去

import { add } from './math'

add(222, 2)
