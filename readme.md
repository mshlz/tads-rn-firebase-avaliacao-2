# tads-rn-firebase-avaliacao-2

## como rodar
```bash
# se nao tiver o yarn, instale o yarn
npm i -g yarn

# instalar as dependencias
yarn install

# iniciar o expo
yarn start

# escanei o qr code no app expo go (na web o mapa não funciona)
```

## > ações
## registrar item
- após registrar/entrar, `menu lateral > formulário`
- caso você tenha editado algum item, pressione `limpar formulario`

## alterar item
- para editar um item, abra a página de `listar` e toque sobre algum item
- o item será carregado no `formulário`, após a edição pressione em salvar para altualizar o item

## remover item
- para remover um item, abra a página de `listar`, pressione e segure sobre o item que deseja remover
- será pedido para confirmar a remoção

## alterar lat/lng de um item no mapa
- na página de `mapa`, para alterar a coordenada de um marcador, pressione e segure sobre o marcador para habilitar a movimentação, após soltar a coordenada será atualizada

---
### Estrutura do firestore
```
/--
  {userId}/         // segmentação por usuário na raiz
    info {          // info do usuario coletada no registro
      name
      email
      cpf
    }
    data {
      items {         // collection de itens adicionados pelo usuario
        {itemId} {
          name
          lat
          lng
          img
        }
        ...
        {itemId} {    // acessar esse item é o equivalente a 
          name        // firestore.doc(`{userId}/data/items/{itemId}`)
          lat
          lng
          img
        }
      }
    }
  ...
```


### Estrutura do storage
```
/--
  images/
    {userId}/
      xxxxx.jpg
      xxxxy.jpg
      xxxxz.jpg
      ...
```