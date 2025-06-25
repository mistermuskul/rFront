<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card class="admin-dashboard">
          <q-card-section>
            <div class="text-h5">Админ-панель</div>
            <div class="text-subtitle2 q-mt-sm">Добро пожаловать в систему управления</div>
          </q-card-section>
          
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-card class="bg-primary text-white">
                  <q-card-section>
                    <div class="text-h6">Управление проектами</div>
                    <div class="text-subtitle2">Добавляйте и редактируйте проекты</div>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-md-6">
                <q-card class="bg-secondary text-white">
                  <q-card-section>
                    <div class="text-h6">Профиль героя</div>
                    <div class="text-subtitle2">Настройте главную информацию</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({
  name: 'IndexPage'
});
</script>

<style scoped>
.admin-dashboard {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
