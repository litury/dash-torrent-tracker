const fetchWrapper = (url, options) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('ResponseErrorTimeout')), 30000)
    fetch(url, options).catch(reject).then(resolve)
  })
}

const call = async (path, method, body) => {
  try {
    const apiUrl = 'https://testnet.platform-explorer.pshenmic.dev'
    const response = await fetchWrapper(`${apiUrl}/${path}`, {
      method,
      headers: {
        'content-type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if (response.status === 200) {
      return response.json()
    } else if (response.status === 404) {
      throw new Error(`Request to Platform Explorer [${method}] ${path} failed with error Not Found (HTTP 404)`)
    } else if (response.status === 400) {
      const {error} = await response.json()

      throw new Error(error)
    } else {
      const text = await response.text()
      console.error(text)
      const error = new Error(`Request to Platform Explorer [${method}] ${path} failed with unexpected status code (HTTP ${response.status})`)
      throw error
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

const getBlockByHash = (hash) => {
  return call(`block/${hash}`, 'GET')
}

const getTransactionsHistory = (start, end, intervalsCount) => {
  return call(`transactions/history?start=${start}&end=${end}${intervalsCount ? `&intervalsCount=${intervalsCount}` : ''}`, 'GET')
}

const getTransactions = (page = 1, limit = 30, order = 'asc') => {
  return call(`transactions?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getTransaction = (txHash) => {
  return call(`transaction/${txHash}`, 'GET')
}

const getBlocks = (page = 1, limit = 30, order = 'asc') => {
  return call(`blocks?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getBlocksByValidator = (proTxHash, page = 1, limit = 30, order = 'asc') => {
  return call(`validator/${proTxHash}/blocks?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getDataContractByIdentifier = (identifier) => {
  return call(`dataContract/${identifier}`, 'GET')
}

const getRawDataContract = (identifier) => {
  return call(`dataContract/${identifier}/raw`, 'GET')
}

const getDataContractTransactions = (identifier, page = 1, limit = 30, order = 'asc') => {
  return call(`dataContract/${identifier}/transactions?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getDataContracts = (page = 1, limit = 30, order = 'asc', orderBy) => {
  return call(`dataContracts?page=${page}&limit=${limit}&order=${order}${orderBy ? `&order_by=${orderBy}` : ''}`, 'GET')
}

const getDocumentByIdentifier = (identifier, dataContractId, typeName) => {
  const params = []
  if (dataContractId) params.push(`contract_id=${dataContractId}`)
  if (typeName) params.push(`document_type_name=${typeName}`)
  const queryParams = params.join('&')

  return call(`document/${identifier}?${queryParams ? `?${queryParams}` : ''}`, 'GET')
}

const getRawDocument = (identifier, dataContractId, typeName) => {
  const params = []
  if (dataContractId) params.push(`contract_id=${dataContractId}`)
  if (typeName) params.push(`document_type_name=${typeName}`)
  const queryParams = params.join('&')

  return call(`document/${identifier}/raw?${queryParams ? `${queryParams}` : ''}`, 'GET')
}

const getDocumentRevisions = (identifier, page = 1, limit = 30, order = 'asc') => {
  return call(`document/${identifier}/revisions?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getDocumentsByDataContract = (dataContractIdentifier, page = 1, limit = 30, order = 'asc') => {
  return call(`dataContract/${dataContractIdentifier}/documents?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getEpoch = (identifier) => {
  return call(`epoch/${identifier}`, 'GET')
}

const getTransactionsByIdentity = (identifier, page = 1, limit = 10, order = 'asc') => {
  return call(`identity/${identifier}/transactions?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getDataContractsByIdentity = (identifier, page = 1, limit = 10, order = 'asc') => {
  return call(`identity/${identifier}/dataContracts?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getDocumentsByIdentity = (identifier, page = 1, limit = 10, order = 'asc') => {
  return call(`identity/${identifier}/documents?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getWithdrawalsByIdentity = (identifier, page = 1, limit = 10, order = 'asc') => {
  return call(`identity/${identifier}/withdrawals?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getTransfersByIdentity = (identifier, page = 1, limit = 10, order = 'asc') => {
  return call(`identity/${identifier}/transfers?page=${page}&limit=${limit}&order=${order}`, 'GET')
}

const getIdentity = (identifier) => {
  return call(`identity/${identifier}`, 'GET')
}
const getIdentityContractNonce = (dataContractIdentifier, identifier) => {
  return call(`identity/${identifier}/contract/${dataContractIdentifier}/nonce`, 'GET')
}

const getIdentities = (page = 1, limit = 30, order = 'asc', orderBy) => {
  return call(`identities?page=${page}&limit=${limit}&order=${order}${orderBy ? `&order_by=${orderBy}` : ''}`, 'GET')
}

const getValidators = (page = 1, limit = 30, order = 'asc', isActive, orderBy) => {
  return call(`validators?page=${page}&limit=${limit}&order=${order}${typeof isActive === 'boolean' ? `&isActive=${String(isActive)}` : ''}${orderBy ? `&order_by=${orderBy}` : ''}`, 'GET')
}

const getValidatorByProTxHash = (proTxHash) => {
  return call(`validator/${proTxHash}`, 'GET')
}

const getBlocksStatsByValidator = (proTxHash, start, end, intervalsCount) => {
  return call(`validator/${proTxHash}/stats?start=${start}&end=${end}${intervalsCount ? `&intervalsCount=${intervalsCount}` : ''}`, 'GET')
}

const getRewardsStatsByValidator = (proTxHash, start, end, intervalsCount) => {
  return call(`validator/${proTxHash}/rewards/stats?start=${start}&end=${end}${intervalsCount ? `&intervalsCount=${intervalsCount}` : ''}`, 'GET')
}

const getStatus = () => {
  return call('status', 'GET')
}

const getRate = () => {
  return call('rate', 'GET')
}

const search = (query) => {
  return call(`search?query=${query}`, 'GET')
}

const decodeTx = (base64) => {
  return call('transaction/decode', 'POST', { base64 })
}

const broadcastTx = (base64) => {
  return call('transaction/broadcast', 'POST', { base64 })
}

export {
  getStatus,
  getBlocks,
  getBlockByHash,
  getTransactionsHistory,
  getTransactions,
  getTransaction,
  search,
  decodeTx,
  getRawDataContract,
  getDocumentsByDataContract,
  getDocumentByIdentifier,
  getDocumentRevisions,
  getDataContractByIdentifier,
  getDataContracts,
  getIdentities,
  getIdentity,
  getIdentityContractNonce,
  getTransactionsByIdentity,
  getDataContractsByIdentity,
  getDataContractTransactions,
  getDocumentsByIdentity,
  getTransfersByIdentity,
  getWithdrawalsByIdentity,
  getValidators,
  getValidatorByProTxHash,
  getBlocksByValidator,
  getBlocksStatsByValidator,
  getRewardsStatsByValidator,
  getEpoch,
  getRate,
  broadcastTx,
  getRawDocument
}
