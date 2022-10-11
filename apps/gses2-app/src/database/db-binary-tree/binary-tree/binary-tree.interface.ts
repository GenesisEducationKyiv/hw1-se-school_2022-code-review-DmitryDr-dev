import { IBinaryTreeNode } from './binary-tree-node.interface';

export interface IBinaryTree<T> {
  root: IBinaryTreeNode<T> | null;
}
