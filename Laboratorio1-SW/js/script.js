(function () {

    let idNuevo = 0;

    let userId = {};
    let id = {};
    let title = {};
    let body = {};


    let btnAceptar = {};
    let btnCancelar = {};

    let postInit = {
        userId: 0,
        id: 0,
        title: '',
        body: '',
    };

    let post = { ...postInit };
    let Posts = [];




    const init = () => {
        userId = document.querySelector('#userId');
        id = document.querySelector('#id');
        title = document.querySelector('#title');
        body = document.querySelector('#body');
        btnAceptar = document.querySelector('#btnAceptar');
        btnCancelar = document.querySelector('#btnCancelar');
        bind();
        cargarDatosPost();
    }





    const bind = () => {
        btnAceptar.onclick = ejecutarSalvar;
        btnCancelar.onclick = ejecutarCancelar;
        userId.onchange = cambiarValor;
        // id.onchange = cambiarValor;
        title.onchange = cambiarValor;
        body.onchange = cambiarValor;
    }


    const cambiarValor = (e) => {
        const { id, value } = e.target;
        post[id] = value;
        console.log(id, ':', value);
    }


    const ejecutarSalvar = async (e) => {

        e.preventDefault();
        if (post.id == 0) {
            post.id = idNuevo;
            Posts.push({ ...post });
            idNuevo++;
        } else {
            await Posts.forEach(p => {
                if (p.id == post.id) {
                    p.userId = post.userId;
                    p.title = post.title;
                    p.body = post.body;
                }

            })

        }
        cargarTabla();
        limpiar();
        alert('Post guardado');
    }

    const ejecutarCancelar = (e) => {
        e.preventDefault();
        limpiar();
    }

    const limpiar = () => {
        document.querySelector('form').reset();
        post = { ...postInit };
    }



    const cargarDatosPost = async () => {
        Posts = await fetch("https://jsonplaceholder.typicode.com/posts")
            .then(response => response.json());
        Posts = Posts.map(p => {
            if (idNuevo <= p.id) idNuevo = p.id + 1;
            return {
                userId: p.userId,
                id: p.id,
                title: p.title,
                body: p.body
            };
        });

        cargarTabla();

    }

    const cargarTabla = async () => {
        const tabla = document.querySelector('#tblDatos');
        tabla.innerHTML = '';
        await Posts.forEach(p => {
            tabla.innerHTML += `<tr>
        <td>${p.id}</td>
        <td>${p.userId}</td>
        <td>${p.title}</td>
        <td>${p.body}</td>
        <td>
            <button class="btn btn-success" data-id=${p.id}>Editar</button>
            <button class="btn btn-danger" data-id=${p.id}>Eliminar</button>
            <button class="btn btn-info" data-id=${p.id}>Ver comentarios</button>
        </td>
    </tr>`;
        });
        asignarFuncion('btn-success', editarPost);
        asignarFuncion('btn-danger', eliminarPost);
        asignarFuncion('btn-info', verComentarios);

    }


    const asignarFuncion = (clase, funcion) => {
        document.querySelectorAll('.' + clase).forEach(button => button.onclick = funcion);
    }





    const editarPost = (e) => {
        const id = e.target.dataset.id;


        Posts.forEach(p => {
            if (p.id == id) {
                this.id.value = p.id;
                userId.value = p.userId;
                title.value = p.title;
                body.value = p.body;
                post = { ...p };
            }

        });

    }

    const eliminarPost = (e) => {
        const id = e.target.dataset.id;
        Posts = Posts.filter(p => p.id != id);
        cargarTabla();
    }

    const verComentarios = (e) => {

        const postId = e.target.dataset.id;
        const modalComentarios = new bootstrap.Modal(document.getElementById('commentsModal'));
        const listaComentarios = document.getElementById('commentList');

        // Hacemos filtracion de los Comments por postId y lo comparamos a nuestro Id en Posts
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
            .then(response => response.json())
            .then(comments => {

                listaComentarios.innerHTML = '';

                // agregamos los comentarios al modal
                comments.forEach(comment => {
                    listaComentarios.innerHTML += `<li class="list-group-item">
                        <strong>${comment.name}</strong> (${comment.email})
                        <p>${comment.body}</p>
                    </li>`;
                });


                modalComentarios.show();
            });
    }



    init();
})()








