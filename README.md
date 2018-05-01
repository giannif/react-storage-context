# react-storage-context

> Get and set local and session storage

_Wrote this pretty quickly on my gf's computer, will be refining_

[![NPM](https://img.shields.io/npm/v/react-storage-context.svg)](https://www.npmjs.com/package/react-storage-context) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-storage-context
```

## Usage

`StorageContext`

```jsx
import StorageContext from "react-storage-context"

@StorageContext("your-storage-id")
class App extends PureComponent {
  render() {
    // children that will read and write storage
  }
}
```

`withStorageContext`

```jsx
import { withStorageContext } from "react-storage-context"

@withStorageContext
class App extends Pu_reComponent {
  render() {
    // props to read
    const {
      local: { someLocalVal },
      session
    } = this.props
    // props to invoke save methods
    const { saveLocal, saveSession } = this.props
    return <div>{someLocalVal}</div>
  }
}
```

`Consumer`

```jsx
import { Consumer } from "react-storage-context"

class App extends PureComponent {
  render() {
    // render props
    return (
      <Consumer>{({ session }) => <div>Session storage values{JSON.stringify(session, undefined, 4)}</div>}</Consumer>
    )
  }
}
```

## License

MIT © [giannif](https://github.com/giannif)
