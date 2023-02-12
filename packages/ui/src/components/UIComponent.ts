import { createUiDelegate, Messenger } from '@figmania/common'
import { Component } from 'react'

export abstract class UIComponent<P = {}, S = {}> extends Component<P, S> {
  public messenger = new Messenger(createUiDelegate())
}
