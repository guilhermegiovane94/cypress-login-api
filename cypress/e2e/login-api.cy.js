const LoginApi = require('../pages/LoginApi')

describe('Validação de Login - Backend Only (API)', () => {
  const loginApi = new LoginApi()

  beforeEach(function () {
    cy.fixture('users').as('users')
  })

  context('Validação de endpoint e estrutura da resposta', () => {
    it('Deve responder com status e estrutura válida ao chamar o endpoint de login', function () {
      loginApi.login(this.users.validUser).then((response) => {
        loginApi.validateResponseStructure(response)
        loginApi.validateContentTypeJson(response)
      })
    })
  })

  context('Login com credenciais válidas', () => {
    it('Deve retornar status 200 e um token ao fazer login com usuário válido', function () {
      loginApi.login(this.users.validUser).then((response) => {
        loginApi.validateSuccessfulLogin(response)

        // Garante que a resposta contém a chave token na estrutura retornada
        expect(response.body).to.include.keys('token')
      })
    })

    it('O token retornado deve ser uma string não vazia', function () {
      loginApi.login(this.users.validUser).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.token).to.be.a('string')
        expect(response.body.token.length).to.be.greaterThan(0)
      })
    })
  })

  context('Login com credenciais inválidas', () => {
    it('Deve retornar status 400 ao usar usuário/senha inválidos', function () {
      loginApi.login(this.users.invalidUser).then((response) => {
        loginApi.validateFailedLogin(response)
      })
    })

    it('Deve retornar mensagem de erro ao usar credenciais inválidas', function () {
      loginApi.login(this.users.invalidUser).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.exist
        expect(response.body.error).to.be.a('string')
      })
    })
  })

  context('Validação de campos obrigatórios (body incompleto)', () => {
    it('Deve retornar erro ao enviar login sem o campo password', function () {
      loginApi.login(this.users.missingPassword).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.include('Missing password')
      })
    })

    it('Deve retornar erro ao enviar login sem o campo email', function () {
      loginApi.login(this.users.missingEmail).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
      })
    })

    it('Deve retornar erro ao enviar body vazio', function () {
      loginApi.login(this.users.emptyBody).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
      })
    })
  })

  context('Fluxo completo de validação backend (happy path + negative)', () => {
    it('Deve validar todo o contrato de sucesso e de erro do endpoint de login', function () {
      // --- Sucesso ---
      loginApi.login(this.users.validUser).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('token')
        expect(response.headers['content-type']).to.include('application/json')
        expect(response.duration).to.be.a('number')
      })

      // --- Falha ---
      loginApi.login(this.users.invalidUser).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.not.be.empty
      })
    })
  })
})
