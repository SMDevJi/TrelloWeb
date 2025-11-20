import axios from 'axios';

const BASE = process.env.TRELLO_API_BASE;

const auth = {
  key: process.env.TRELLO_API_KEY,
  token: process.env.TRELLO_API_TOKEN
};


//cards related all endpoints

export const createCard = async ({ idList, name, desc }) => {
  const url = `${BASE}/cards`;
  const res = await axios.post(url, null, { params: { ...auth, idList, name, desc } });

  const reduced = {
    success: true,
    card: {
      id: res.data.id,
      name: res.data.name,
      desc: res.data.desc,
      idList: res.data.idList
    }
  }

  return reduced;
};




export const updateCard = async (cardId, payload) => {
  const url = `${BASE}/cards/${cardId}`;

  
  const finalPayload = {
    ...auth,
    ...payload
  };

  const res = await axios.put(url, null, { params: finalPayload });

  return {
    success: true,
    card: {
      id: res.data.id,
      name: res.data.name,
      desc: res.data.desc,
      idList: res.data.idList,
      pos: res.data.pos
    }
  };
};






export const deleteCard = async (cardId) => {
  const url = `${BASE}/cards/${cardId}`;
  const res = await axios.delete(url, { params: { ...auth } });

  const reduced = {
    success: true
  }

  return reduced;
};










//board related..
export const createBoard = async (name,defaultLists) => {
  const url = `${BASE}/boards`;
  const res = await axios.post(url, null, {
    params: { ...auth, name, defaultLists }
  }
  );


  const board = res.data;

  //registering wh
  await axios.post(
    `${BASE}/webhooks/`,
    new URLSearchParams({
      description: `Webhook for board ${board.id}`,
      callbackURL: `${process.env.PUBLIC_URL}/trello/webhook`,
      idModel: board.id,
      key: auth.key,
      token: auth.token
    })
  );


  const reduced = {
    success: true,
    board: {
      id: res.data.id,
      name: res.data.name
    }
  }
  //console.log(res.data)
  return reduced;
};




export const deleteBoard = async (boardId) => {


  //deleting the wh
  const res = await axios.get(`${BASE}/tokens/${auth.token}/webhooks`, {
    params: { ...auth }
  }
  );
  //console.log(res.data)

  const item = res.data.find(obj => obj.idModel === boardId);
  const whId = item.id

  //console.log(item,whId)

  await axios.delete(`${BASE}/webhooks/${whId}`, {
    params: { ...auth }
  }
  );



  //deleting board
  const url = `${BASE}/boards/${boardId}`;
  await axios.delete(url, {
    params: { ...auth }
  }
  );

  const reduced = {
    success: true,
    id: boardId,
    message: "Board deleted successfully!"
  }
  return reduced;
};


export const getAllBoards = async () => {
  const username = process.env.TRELLO_USERNAME;

  const url = `${BASE}/members/${username}/boards`;
  const res = await axios.get(url, {
    params: { ...auth }
  }
  );

  const reduced = {
    success: true,
    boards:
      res.data.map(each => ({
        id: each.id,
        name: each.name
      })
      )
  }
  //console.log(res.data)
  return reduced;
};



export const getBoard = async (boardId) => {
  try {
    const url = `${BASE}/boards/${boardId}`;
    const res = await axios.get(url, {
      params: {
        ...auth,
        fields: "name", 
        lists: "all",
        list_fields: "name",
        cards: "all",
        card_fields: "name,desc,idList,pos"
      }
    });

    let board = res.data;
    
    if (board.cards?.length) {
      board.cards = board.cards.sort((a, b) => {
        return a.pos - b.pos;
      });
    }

    return {
      success: true,
      board
    };

  } catch (error) {
    console.error("Error fetching board:", error);
    return { success: false, error: error.message };
  }
};




