package routes

import (
	"github.com/go-chi/chi"
	"github.com/stakwork/sphinx-tribes/auth"
	"github.com/stakwork/sphinx-tribes/handlers"
)

func OrganizationRoutes() chi.Router {
	r := chi.NewRouter()

	r.Group(func(r chi.Router) {
		r.Get("/", handlers.GetOrganizations)
		r.Get("/count", handlers.GetOrganizationsCount)
		r.Get("/{uuid}", handlers.GetOrganizationByUuid)
		r.Get("/users/{uuid}", handlers.GetOrganizationUsers)
		r.Get("/users/{uuid}/count", handlers.GetOrganizationUsersCount)
		r.Get("/bounties/{uuid}", handlers.GetOrganizationBounties)
		r.Get("/user/{userId}", handlers.GetUserOrganizations)
	})
	r.Group(func(r chi.Router) {
		r.Use(auth.PubKeyContext)

		r.Post("/", handlers.CreateOrEditOrganization)
		r.Post("/users/{uuid}", handlers.CreateOrganizationUser)
		r.Delete("/users/{uuid}", handlers.DeleteOrganizationUser)
		r.Post("/users/role/{uuid}/{user}", handlers.AddUserRoles)

		r.Get("/bounty/roles", handlers.GetBountyRoles)
		r.Get("/users/role/{uuid}/{user}", handlers.GetUserRoles)
		r.Get("/budget/{uuid}", handlers.GetOrganizationBudget)
		r.Get("/budget/history/{uuid}", handlers.GetOrganizationBudgetHistory)
		r.Get("/payments/{uuid}", handlers.GetPaymentHistory)
		r.Get("/poll/invoices/{uuid}", handlers.PollBudgetInvoices)
		r.Get("/invoices/count/{uuid}", handlers.GetInvoicesCount)
	})
	return r
}
