import React from 'react'
import MockWebStorage from 'mock-webstorage'
import renderer from 'react-test-renderer'
import StorageContext, { withStorageContext, Consumer } from './'

const EmptyTest = withStorageContext(({ local, saveLocal, saveSession, session }) => (
  <div
    onClick={() => {
      saveLocal()
      saveSession()
    }}
  >
    {local.localStorageVal}
    {session.someVal}
  </div>
))
const App = StorageContext('test-id')(({ children }) => children)
describe('react-storage-context', () => {
  it('imports', () => {
    expect(StorageContext).toBeTruthy()
    expect(withStorageContext).toBeTruthy()
    expect(Consumer).toBeTruthy()
  })
})
describe('react-storage-context no storage', () => {
  it('no errors when no storage', () => {
    const component = renderer.create(
      <App>
        <EmptyTest />
      </App>
    )
    let tree = component.toJSON()
    tree.props.onClick()
  })
})
describe('react-storage-context api', () => {
  beforeEach(() => {
    global.localStorage = new MockWebStorage()
    global.sessionStorage = new MockWebStorage()
    localStorage.setItem('test-id', JSON.stringify({ localStorageVal: 'banana' }))
    sessionStorage.setItem('test-id', JSON.stringify({ sessionStorageVal: 'apples' }))
  })
  it('with out provider', () => {
    // probably not worth testing
    const component = renderer.create(<EmptyTest />)
    let tree = component.toJSON()
    expect(tree.children).toEqual(null)
    tree.props.onClick()
  })
  it('test local storage read/write', () => {
    const Test = withStorageContext(({ local, saveLocal }) => (
      <div onClick={() => saveLocal({ localStorageVal: 'kiwi' })}>{local.localStorageVal}</div>
    ))
    const component = renderer.create(
      <App>
        <Test />
      </App>
    )
    let tree = component.toJSON()
    const [text] = tree.children
    expect(text).toEqual('banana')
    tree.props.onClick()
    tree = component.toJSON()
    const [text2] = tree.children
    expect(text2).toEqual('kiwi')
  })
  it('test local storage augments', () => {
    const Test = () => (
      <Consumer>
        {({ local, saveLocal }) => (
          <div onClick={() => saveLocal({ otherStorageVal: 'berries' })}>{`${local.otherStorageVal}-${
            local.localStorageVal
          }`}</div>
        )}
      </Consumer>
    )
    const component = renderer.create(
      <App>
        <Test />
      </App>
    )
    let tree = component.toJSON()
    tree.props.onClick()
    tree = component.toJSON()
    const [text] = tree.children
    expect(text).toEqual('berries-banana')
  })
  it('test session storage read/write', () => {
    const Test = withStorageContext(({ session, saveSession }) => (
      <div onClick={() => saveSession({ sessionStorageVal: 'kiwi' })}>{session.sessionStorageVal}</div>
    ))
    const component = renderer.create(
      <App>
        <Test />
      </App>
    )
    let tree = component.toJSON()
    const [text] = tree.children
    expect(text).toEqual('apples')
    tree.props.onClick()
    tree = component.toJSON()
    const [text2] = tree.children
    expect(text2).toEqual('kiwi')
  })
  it('test session storage augments', () => {
    const Test = () => (
      <Consumer>
        {({ session, saveSession }) => (
          <div onClick={() => saveSession({ otherStorageVal: 'pears' })}>
            {`${session.otherStorageVal}-${session.sessionStorageVal}`}
          </div>
        )}
      </Consumer>
    )

    const component = renderer.create(
      <App>
        <Test />
      </App>
    )
    let tree = component.toJSON()
    tree.props.onClick()
    tree = component.toJSON()
    const [text] = tree.children
    expect(text).toEqual('pears-apples')
  })
})
