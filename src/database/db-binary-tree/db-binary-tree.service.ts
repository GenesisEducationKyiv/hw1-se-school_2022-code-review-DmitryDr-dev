import { Injectable } from '@nestjs/common';
import {
  BinaryTree,
  BinaryTreeNode,
  IBinaryTree,
  IBinaryTreeNode,
} from './binary-tree';

@Injectable()
export class DbBinaryTreeService {
  public createTree<T>(): IBinaryTree<T> {
    return new BinaryTree();
  }

  public async addValue<T>(
    tree: IBinaryTree<T>,
    value: T,
  ): Promise<IBinaryTree<T> | null> {
    const treeNode = tree.root;

    if (treeNode === null) {
      tree.root = new BinaryTreeNode(value);
      return tree;
    }

    function searchTree(node: IBinaryTreeNode<T>) {
      if (value < node.value) {
        if (node.left === null) {
          node.left = new BinaryTreeNode(value);
          return tree;
        }
        if (node.left !== null) {
          return searchTree(node.left as IBinaryTreeNode<T>);
        }
      } else if (value > node.value) {
        if (node.right === null) {
          node.right = new BinaryTreeNode(value);
          return tree;
        }
        if (node.right !== null) {
          return searchTree(node.right as IBinaryTreeNode<T>);
        }
      }

      return null;
    }

    return searchTree(treeNode);
  }

  public async findValue<T>(tree: IBinaryTree<T>, value: T) {
    function traverse(node: IBinaryTreeNode<T>) {
      if (value === node.value) return value;
      if (value > node.value) return traverse(node.right);
      if (value < node.value) return traverse(node.left);

      return null;
    }

    return traverse(tree.root);
  }

  public async getAllValues<T>(tree: IBinaryTree<T>): Promise<T[] | null> {
    if (tree.root === null) {
      return null;
    }

    const result: Array<T> = [];

    function traverse(node: IBinaryTreeNode<T>) {
      node.left && traverse(node.left); // eslint-disable-line
      node.right && traverse(node.right); // eslint-disable-line
      result.push(node.value);
    }

    traverse(tree.root);

    return result;
  }
}
