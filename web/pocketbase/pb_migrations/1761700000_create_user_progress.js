/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const users = app.findCollectionByNameOrId("users")

  const collection = new Collection({
    type: "base",
    name: "user_progress",
    listRule: "user = @request.auth.id",
    viewRule: "user = @request.auth.id",
    createRule: "@request.auth.id != \"\" && @request.body.user = @request.auth.id",
    updateRule: "user = @request.auth.id && @request.body.user:isset = false",
    deleteRule: null,
    fields: [
      {
        type: "relation",
        name: "user",
        required: true,
        collectionId: users.id,
        cascadeDelete: true,
        maxSelect: 1,
      },
      {
        type: "json",
        name: "progress",
      },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_user_progress_user ON user_progress (user)",
    ],
  })

  app.save(collection)
}, (app) => {
  app.delete(app.findCollectionByNameOrId("user_progress"))
})
