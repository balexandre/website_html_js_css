// todos os produtos disponiveis para encomendar
var PRODUTOS_BASE = [
  {
    id: 1,
    nome: "Item #1",
    preco: 10000,
    desconto: 0,
    stock: 10,
    imagem: "https://placehold.jp/100x100.png",
    activo: true,
  },
  {
    id: 2,
    nome: "Item #2",
    preco: 9900,
    desconto: 0,
    stock: 2,
    imagem: "https://placehold.jp/100x100.png",
    activo: true,
  },
  {
    id: 3,
    nome: "Item #3",
    preco: 1240,
    desconto: 0,
    stock: 1,
    imagem: "https://placehold.jp/100x100.png",
    activo: true,
  },
  {
    id: 4,
    nome: "Item #4",
    preco: 140,
    desconto: 0,
    stock: 1,
    imagem: "https://placehold.jp/100x100.png",
    activo: true,
  },
  {
    id: 5,
    nome: "Item #5",
    preco: 1120,
    desconto: 0,
    stock: 3,
    imagem: "https://placehold.jp/100x100.png",
    activo: true,
  },
  {
    id: 6,
    nome: "Item #6",
    preco: 990,
    desconto: 0,
    stock: 31,
    imagem: "https://placehold.jp/100x100.png",
    activo: true,
  },
  {
    id: 7,
    nome: "Item #7",
    preco: 7190,
    desconto: 0,
    stock: 22,
    imagem: "https://placehold.jp/100x100.png",
    activo: true,
  },
  {
    id: 8,
    nome: "Item #8",
    preco: 190,
    desconto: 0,
    stock: 4,
    imagem: "https://placehold.jp/100x100.png",
    activo: true,
  },
  {
    id: 9,
    nome: "Item #9",
    preco: 963,
    desconto: 0,
    stock: 15,
    imagem: "https://placehold.jp/100x100.png",
    activo: true,
  },
  {
    id: 10,
    nome: "Item #10",
    preco: 730,
    desconto: 0,
    stock: 134,
    imagem: "https://placehold.jp/100x100.png",
    activo: true,
  }
];

// class para gerir produtos
class SiteComprasProdutos {
  constructor() {
    this.dados = PRODUTOS_BASE;
  }

  getDados() {
    return this.dados;
  }
}

// class para gerir utilizadores
class SiteComprasUtilizadoresLocalStorage {
  constructor() {
    this.dados = JSON.parse(localStorage.getItem("utilizadores")) || [];
  }

  getDados() {
    return this.dados;
  }

  setDados(dados) {
    this.dados = dados;
    if (dados) {
      localStorage.setItem("utilizadores", JSON.stringify(dados));
    } else {
      localStorage.removeItem("utilizadores");
    }
  }
}

// class para gerir sessao do utilizador logado e o cesto de compras
class SiteComprasSessoesUtilizadoresLocalStorage {
  constructor() {
    this.dados = JSON.parse(localStorage.getItem("sessoes")) || null;
  }

  getDados() {
    return this.dados;
  }

  setDados(dados) {
    this.dados = dados;
    if (dados) {
      localStorage.setItem("sessoes", JSON.stringify(dados));
    } else {
      this.dados = null;
      localStorage.removeItem("sessoes");
    }
  }

  adicionarAoCesto(produto, quantidade) {
    var sessaoAtual = this.getDados();
    var cestoAtual = [
      ...sessaoAtual.cesto,
      {...produto, quantidade },
    ];
    sessaoAtual.cesto = cestoAtual;
    this.setDados(sessaoAtual);
  }

  getTotaisCesto() {
    var sessaoAtual = this.getDados();
    if (sessaoAtual) {
      var cestoAtual = sessaoAtual.cesto;
      var totalNumerario = 0;
      var totalArtigos = 0;

      if (cestoAtual) {
        cestoAtual.forEach(function (item) {
          totalNumerario += item.preco * item.quantidade;
          totalArtigos += item.quantidade;
        });
      }
    }

    return {
      numerario: totalNumerario,
      artigos: totalArtigos,
    };
  }
}

// classe que compoem a funcionalidade do site de compras
class SiteCompras {
  constructor() {
    this.produtos = new SiteComprasProdutos();
    this.utilizadores = new SiteComprasUtilizadoresLocalStorage();
    this.sessao = new SiteComprasSessoesUtilizadoresLocalStorage();
  }

  // cria um novo utilizador, validando os campos
  criarUtilizador(inputs) {
    // desconstrucao (deconstructing) da variavel input
    var { nome, email, password1, password2, morada } = inputs;

    var nomeValor = document.getElementById(nome).value;
    var emailValor = document.getElementById(email).value;
    var moradaValor = document.getElementById(morada).value;
    var pwd1Valor = document.getElementById(password1).value;
    var pwd2Valor = document.getElementById(password2).value;
    
    var errors = [];
    errors.push(this.validarCampo("nome", nomeValor));
    errors.push(this.validarCampo("email", emailValor));
    errors.push(this.validarCampo("morada", moradaValor));
    errors.push(this.validarCampo("pwd", pwd1Valor, pwd2Valor));

    // retorna apenas as validacoes com erro (apaga os "null")
    var errosMostrar = errors.filter(element => {
      return element !== null;
    });

    if (errosMostrar.length === 0) {
      // existe email?
      var utilizadores = this.utilizadores.getDados();
      var duplicado = utilizadores.find(user => user.email === emailValor);
      if (duplicado) {
        return [{ campo: "fEmail", mensagem: "Esse utilizador já existe, tente fazer login..." }];
      }

      // nao há utilizadores duplicados, adiciona-mos o novo utilizador
      this.utilizadores.setDados([
        ...this.utilizadores.getDados(),
        {
          nome: nomeValor,
          email: emailValor,
          morada: moradaValor,
          password: pwd1Valor,
          criadoEm: new Date()
        }
      ])
    }

    return errosMostrar; // []
  }

  // funcao auxiliar para validar campos
  validarCampo(tipoCampo, valorCampo, valorCampo2) {
    if (tipoCampo === "nome") {
      // tem de existir
      if (!valorCampo) {
        return { campo: "fNome", mensagem: "Campo obrigatório" };
      }
      // deve comecar por maiuscula
      if (valorCampo[0] !== valorCampo[0].toUpperCase()) {
        return { campo: "fNome", mensagem: "A primeira letra tem de ser maiuscula" };
      }
      // minimo 4 carateres
      if (valorCampo.length < 4) {
        return { campo: "fNome", mensagem: "Use pelo menos 4 carateres" };
      }
      // nao pode conter numeros
      if (!new RegExp(/^([^0-9]*)$/).test(valorCampo)) {
        return { campo: "fNome", mensagem: "Nao pode conter carateres decimais" };
      }
    }
    if (tipoCampo === "email") {
      // tem de existir
      if (!valorCampo) {
        return { campo: "fEmail", mensagem: "Campo obrigatório" };
      }
      // deve ter o formatto de nome@domainio.codigo_pais + apenas minusculas
      if (valorCampo.indexOf('@') < 0 && valorCampo.indexOf('.') < 0) {
        return { campo: "fEmail", mensagem: "Email é inválido" };
      }
      
      var emailNome = valorCampo.split('@')[0];
      var emailDominio = valorCampo.split('@')[1].split('.')[0];
      var emailCodigo = valorCampo.split('@')[1].split('.')[1];

      // nome: max 30 carateres
      if (emailNome.length > 30) {
        return { campo: "fEmail", mensagem: "Nome no email tem de ter menos de 30 carateres" };
      }
      // dominio: max 20 carateres
      if (emailDominio.length > 20) {
        return { campo: "fEmail", mensagem: "Dominio no email tem de ter menos de 20 carateres" };
      }
      // codigo_pais: max 2 carateres
      if (emailCodigo.length > 2) {
        return { campo: "fEmail", mensagem: "Codigo do pais no email tem de ter menos de 2 carateres" };
      }
    }
    if (tipoCampo === "morada") {
      // tem de existir
      if (!valorCampo) {
        return { campo: "fMorada", mensagem: "Campo obrigatório" };
      }
      // min 10 carateres
      if (valorCampo.length < 10) {
        return { campo: "fMorada", mensagem: "Morada tem de ter pelo menos 10 carateres" };
      }
    }
    if (tipoCampo === "pwd") {
      // tem de existir
      if (!valorCampo) {
        return { campo: "fPassword1", mensagem: "Campo obrigatório" };
      }
      // pelo menos um carater especial (_ - # ! =)
      if (!new RegExp(/[_\-#!=]/).test(valorCampo)) {
        return { campo: "fPassword1", mensagem: "Palavra chave tem de conter pelo menos 1 caratere especial (_ - # ! =)" };
      }
      // pelo menos um carater maisculo
      if (!new RegExp(/[A-Z]/).test(valorCampo)) {
        return { campo: "fPassword1", mensagem: "Palavra chave tem de conter pelo menos 1 caratere maiusculo (A-Z)" };
      }
      // ter 4 numeros
      var totalNumDecimais = 0;
      valorCampo.split('').map((elm, i) => {
        if (elm.charCodeAt(0) >= 48 && elm.charCodeAt(0) <= 57) { totalNumDecimais++ };
      });
      if (totalNumDecimais < 4) {
        return { campo: "fPassword1", mensagem: "Palavra chave tem de conter pelo menos 4 decimais (0-9)" };
      }
      // min 8 carateres
      if (valorCampo.length < 8) {
        return { campo: "fPassword1", mensagem: "Palavra chave tem de conter pelo menos 8 carateres" };
      }
      // serem iguais
      if (valorCampo !== valorCampo2) {
        return { campo: "fPassword2", mensagem: "Os valores não são os mesmos" };
      }
    }

    return null;
  }

  // faz login do utilizador e cria uma sessao se for válido
  fazerLogin(inputs) {
    var { nome, email, password } = inputs;

    var nomeValor = document.getElementById(nome).value;
    var emailValor = document.getElementById(email).value;
    var pwdValor = document.getElementById(password).value;

    // procurar se utilizador existe
    var utilizador = this.utilizadores.getDados().find(user => {
      return user.email == emailValor &&
        user.password == pwdValor &&
        user.nome === nomeValor;
    });

    if (utilizador) {
      // existe! criar uma sessao com este utilizador, e initializa o cesto vazio
      this.sessao.setDados({...utilizador, cesto: []});
    }

    return utilizador;
  }

  // verifica se existe utilizador logado e se sim, retorna o nome
  verificarUtilizadorExistente() {
    const utilizadorLogado = this.sessao.getDados();
    if (utilizadorLogado) {
      return utilizadorLogado.nome;
    }
    return null;
  }

  // retorna a morada do utilizador logado
  getMoradaUtilizador() {
    var utilizador = this.sessao.getDados();
    return utilizador.morada;
  }

  // retorna todos os produtos a serem consumidos (que estao activos)
  getProdutosDisponiveis() {
    return this.produtos.getDados().filter(produto => produto.activo === true);
  }

  // adiciona produto ao cesto do utilizador
  adicionarAoCesto(produtoId, quantidade) {
    // procurar produto por produtoId
    const produto = this.produtos.getDados().find((produto) => produto.id === Number(produtoId));
    if (produto) {
      // em caso de haver um produto, procura-se se existe no cesto
      var cesto = this.sessao.getDados().cesto;
      const produtoCesto = cesto.find((cestoProduto) => cestoProduto.id === Number(produtoId));

      if (produtoCesto) {
        // caso exista no cesto, adiciona-se apenas a quantidade
        var novaQuantidade = Number(produtoCesto.quantidade) + Number(quantidade);
        if (novaQuantidade <= produto.stock) {
          // adiciona ao cesto se ainda houver em stock
          produtoCesto.quantidade += Number(quantidade);

          if (produtoCesto.quantidade < produto.stock) {
            // enquato for menor
            return 1; // produto adicionado
          }
        }
      } else {
        // o cesto ainda nao tem este produto, adicionamos como novo
        this.sessao.adicionarAoCesto(produto, Number(quantidade));

        if (Number(quantidade) < produto.stock) {
          return 1; // produto adicionado
        }
      }
    }
    return null; // produto nao pode ser adicionado
  }

  // calcula totais do cesto
  getTotalDoCesto() {
    return this.sessao.getTotaisCesto();
  }

  // apaga os dados todos da sessao actual
  terminarSessao() {
    this.sessao.setDados(null);
  }

  limparCesto() {
    var sessao = this.sessao.getDados();
    sessao.cesto = [];
    this.sessao.setDados(sessao);
  }
}
