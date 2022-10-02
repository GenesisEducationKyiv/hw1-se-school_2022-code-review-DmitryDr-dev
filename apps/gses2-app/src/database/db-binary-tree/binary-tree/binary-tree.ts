import { IBinaryTreeNode } from './binary-tree-node.interface';
import { IBinaryTree } from './binary-tree.interface';

export class BinaryTree<T> implements IBinaryTree<T> {
  root: IBinaryTreeNode<T> | null;

  constructor() {
    this.root = null;
  }
}
