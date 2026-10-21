/**
 * Page Object / Service Object para validação de Login via API (backend only)
 * Não interage com frontend — apenas cy.request()
 */
class LoginApi {
  constructor() {
    this.endpoint = '/api/login'
  }

  /**
   * Realiza a requisição de login
   * @param {Object} body - { email, password }
   * @param {Object} options - opções extras do cy.request (failOnStatusCode, etc.)
   */
  login(body, options = {}) {
    return cy.request({
      method: 'POST',
      url: this.endpoint,
      body,
      failOnStatusCode: false, // permite validar status de erro
      ...options,
    })
  }

  /**
   * Valida resposta de sucesso (200 + token)
   */
  validateSuccessfulLogin(response) {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('token')
    expect(response.body.token).to.be.a('string').and.not.be.empty
    return this
  }

  /**
   * Valida resposta de erro (400)
   */
  validateFailedLogin(response) {
    expect(response.status).to.eq(400)
    expect(response.body).to.have.property('error')
    expect(response.body.error).to.be.a('string').and.not.be.empty
    return this
  }

  /**
   * Valida estrutura básica de uma resposta de sucesso
   */
  validateResponseStructure(response) {
    expect(response).to.have.property('status')
    expect(response).to.have.property('body')
    expect(response).to.have.property('headers')
    expect(response).to.have.property('duration')
    return this
  }

  /**
   * Valida que o Content-Type da resposta é JSON
   */
  validateContentTypeJson(response) {
    expect(response.headers).to.have.property('content-type')
    expect(response.headers['content-type']).to.include('application/json')
    return this
  }
}

module.exports = LoginApi
