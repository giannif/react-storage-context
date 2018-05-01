import React, { createContext, PureComponent } from 'react'

const StorageContext = createContext({
  session: {},
  local: {},
  saveLocal: () => {},
  saveSession: () => {}
})

export const Consumer = StorageContext.Consumer

/**
 * HoC providing the storage context values as props
 */
export const withStorageContext = WrappedComponent => props => (
  <StorageContext.Consumer>{context => <WrappedComponent {...props} {...context} />}</StorageContext.Consumer>
)

const parse = (storage = '') => JSON.parse(storage) || {}
const retrieve = (id, isSession) => {
  try {
    return parse(isSession ? sessionStorage.getItem(id) : localStorage.getItem(id))
  } catch (error) {
    console.error(`Error getting ${isSession ? 'session' : 'local'} storage for ${id}`)
  }
  return {}
}
const save = (id, state, isSession) => {
  try {
    const stringy = JSON.stringify(state)
    isSession ? sessionStorage.setItem(id, stringy) : localStorage.setItem(id, stringy)
  } catch (error) {
    console.error(`Error setting ${isSession ? 'session' : 'local'} storage for ${id}`)
  }
}

const StorageWrapper = id => WrappedComponent =>
  class StorageManager extends PureComponent {
    state = {
      session: {}, // session storage goes here
      local: {} // local storage goes here
    }
    saveLocal = newState => {
      const { local } = this.state
      const allLocal = { ...local, ...newState }
      this.setState({ local: allLocal })
      save(id, allLocal)
    }
    saveSession = newState => {
      const { session } = this.state
      const allSession = { ...session, ...newState }
      this.setState({ session: allSession, isSession: true })
      save(id, allSession, true)
    }
    componentWillMount() {
      if (!id) {
        console.error(`id must be specified for StorageContext`)
      }
      this.setState({
        local: retrieve(id),
        session: retrieve(id, true)
      })
    }
    render() {
      const { session, local } = this.state
      return (
        <StorageContext.Provider
          value={{
            session,
            local,
            saveLocal: this.saveLocal,
            saveSession: this.saveSession
          }}
        >
          <WrappedComponent {...this.props} />
        </StorageContext.Provider>
      )
    }
  }

export default StorageWrapper
