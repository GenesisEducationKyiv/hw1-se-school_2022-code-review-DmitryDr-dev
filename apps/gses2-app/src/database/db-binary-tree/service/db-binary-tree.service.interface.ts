import { IBinaryTree } from '../binary-tree';

export interface IDbBinaryTreeService {
  createTree<T>(): IBinaryTree<T>;

  addValue<T>(tree: IBinaryTree<T>, value: T): Promise<IBinaryTree<T> | null>;

  findValue<T>(tree: IBinaryTree<T>, value: T): Promise<string>;

  getAllValues<T>(tree: IBinaryTree<T>): Promise<T[]>;
}
