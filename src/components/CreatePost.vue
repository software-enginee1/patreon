<script lang="ts">
import { defineComponent, ref } from 'vue'
import { db } from '@/firebase'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { useCurrentUser } from 'vuefire'

export default defineComponent({
  setup() {
    const postContent = ref('')
    const user = useCurrentUser()

    async function createPost() {
      console.log('createPost called')

      if (!user.value) {
        alert('You must be logged in to create a post')
        return
      }

      const timestamp = new Date()

      const postData = {
        content: postContent.value,
        dateposted: timestamp,
        likes: 0,
        userId: user.value.uid,
        author: user.value.displayName
      }

      console.log('postData:', postData)

      try {
        const userPostsRef = collection(db, 'users', user.value.uid, 'posts')
        const docRef = await addDoc(userPostsRef, postData)
        console.log('Document written with ID:', docRef.id)

        // Update the document with the postId
        await updateDoc(doc(db, 'users', user.value.uid, 'posts', docRef.id), {
          postId: docRef.id
        })

        postContent.value = ''
      } catch (error) {
        console.log('Error creating post:', error)
      }
    }

    return {
      postContent,
      createPost
    }
  }
})
</script>

<template>
  <div class="create-post">
    <div class="create-post-header"></div>
    <div class="create-post-body">
      <textarea
        v-model="postContent"
        class="typing-box"
        placeholder="What is on your mind?"
        style="resize: none"
      />
      <div class="button-wrapper">
        <button class="submit-button" @click="createPost">
          <img src="@/assets/feather.png" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-post {
  width: 90%;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 20px;
  margin-top: 20px;
}

.typing-box {
  width: 100%;
  resize: none;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  /*margin-top: 1rem;*/
}

.submit-button {
  border: none;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 50px;
}

.submit-button img {
  width: 35px;
  height: 35px;
}
</style>
